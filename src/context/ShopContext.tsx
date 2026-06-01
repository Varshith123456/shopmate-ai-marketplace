import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { db as firestoreDb, auth as firebaseAuth } from '../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Store, Product, Order, Customer, CartItem, Message, StoreSettings } from '../types';

interface ShopContextType {
  stores: Store[];
  products: Product[];
  orders: Order[];
  customers: Customer[];
  settings: StoreSettings;
  isLoggedIn: boolean;
  customerEmail: string;
  cart: CartItem[];
  wishlist: string[];
  activeOrder: Order | null;
  trackingStep: number;
  trackingProgress: number;
  shopperChat: Message[];
  setCustomerEmail: (email: string) => void;
  setIsLoggedIn: (login: boolean) => void;
  incrementCartItem: (pid: string) => void;
  decrementCartItem: (pid: string) => void;
  toggleWishlist: (pid: string) => void;
  addProduct: (p: Omit<Product, 'id' | 'sales'>) => void;
  editProduct: (pid: string, fields: Partial<Product>) => void;
  deleteProduct: (pid: string) => void;
  placeOrder: (details: string, address: string, payment: string, total: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  setShopperChat: React.Dispatch<React.SetStateAction<Message[]>>;
  setTrackingStep: React.Dispatch<React.SetStateAction<number>>;
  setTrackingProgress: React.Dispatch<React.SetStateAction<number>>;
  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  saveOrUpdateUserInFirestore: (emailOrPhone: string, name?: string) => Promise<void>;
  createPaymentRecord: (paymentId: string, orderId: string, amount: number, status: 'success' | 'failed') => Promise<void>;
  createOrderAfterPayment: (orderId: string, details: string, address: string, paymentMethod: string, total: number) => Promise<void>;
}

export const ShopContext = createContext<ShopContextType | null>(null);

const defaultStores: Store[] = [
  { id: "st_1", name: "ShopMate Express", type: "Grocery", rating: 4.9, eta: "10-15 Min", logo: "🥬", fee: 1.49, bg: "from-green-500/10 to-green-600/5", color: "#0c831f" },
  { id: "st_2", name: "Blinkit Mart", type: "Instamart", rating: 4.7, eta: "15-20 Min", logo: "🛒", fee: 0.99, bg: "from-amber-500/10 to-amber-600/5", color: "#f59e0b" },
  { id: "st_3", name: "Wellness Express", type: "Pharmacy", rating: 4.8, eta: "12-18 Min", logo: "💊", fee: 2.49, bg: "from-red-500/10 to-red-600/5", color: "#ef4444" }
];

const defaultProducts: Product[] = [
  // Fruits
  { id: "pd_1", name: "Organic Honeycrisp Apples", category: "Fruits", price: 3.49, unit: "1 kg bag", rating: 4.8, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 85, sales: 38, description: "Crisp and delightfully sweet organic Honeycrisp apples, grown in sunny orchards without synthetic pesticides." },
  { id: "pd_2", name: "Fresh Organic Bananas", category: "Fruits", price: 1.99, unit: "1 bunch (5-6 units)", rating: 4.9, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 150, sales: 95, description: "Naturally sweet and perfectly ripe organic yellow bananas, packed with potassium and ready for snacking or smoothies." },
  { id: "pd_3", name: "Organic Strawberries", category: "Fruits", price: 4.49, unit: "1 lb clamshell", rating: 4.7, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 60, sales: 42, description: "Plump, juicy, and ruby-red organic strawberries, hand-picked at peak ripeness for ultimate flavor." },
  { id: "pd_4", name: "Sweet Blueberries", category: "Fruits", price: 3.99, unit: "6 oz pack", rating: 4.9, image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 75, sales: 50, description: "Deliciously sweet and antioxidant-rich blueberries, perfect for baking, yogurt toppings, or eating fresh." },
  { id: "pd_5", name: "Ripe Organic Mangoes", category: "Fruits", price: 5.99, unit: "3 units pack", rating: 4.8, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 40, sales: 28, description: "Tropical, sweet, and fragrant organic Kent mangoes, offering a velvety texture and rich flavor profile." },
  { id: "pd_6", name: "Fresh Seedless Watermelon", category: "Fruits", price: 6.99, unit: "1 whole (medium)", rating: 4.6, image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 30, sales: 15, description: "Thirst-quenching, crisp, and sweet seedless red watermelon, ideal for refreshing summer gatherings." },
  { id: "pd_7", name: "Sweet Green Grapes", category: "Fruits", price: 4.29, unit: "1.5 lb bag", rating: 4.7, image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 70, sales: 36, description: "Plump and seedless green grapes with a satisfying crisp snap and a sweet, refreshing flavor." },
  { id: "pd_8", name: "Organic Raspberries", category: "Fruits", price: 4.99, unit: "6 oz clamshell", rating: 4.8, image: "https://images.unsplash.com/photo-1577234286557-43d54410f852?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 45, sales: 22, description: "Delicate and tangy organic red raspberries, bursting with natural sweetness and fiber." },

  // Vegetables
  { id: "pd_9", name: "Fresh Organic Broccoli", category: "Vegetables", price: 2.99, unit: "1 large head", rating: 4.6, image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 90, sales: 34, description: "Nutrient-dense organic broccoli head with vibrant green florets, perfect for steaming or roasting." },
  { id: "pd_10", name: "Organic Baby Spinach", category: "Vegetables", price: 3.29, unit: "5 oz tub", rating: 4.7, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 55, sales: 31, description: "Pre-washed and tender organic baby spinach leaves, ideal for fresh healthy salads or green smoothies." },
  { id: "pd_11", name: "Roma Vine Tomatoes", category: "Vegetables", price: 2.49, unit: "1 lb pack", rating: 4.8, image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 110, sales: 65, description: "Deep red, firm, and flavorful vine-ripened Roma tomatoes, ideal for fresh sauces and salads." },
  { id: "pd_12", name: "Crisp Organic Carrots", category: "Vegetables", price: 1.89, unit: "2 lb bag", rating: 4.5, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 120, sales: 48, description: "Sweet and crunchy organic whole orange carrots, freshly harvested and great for cooking or raw snacking." },
  { id: "pd_13", name: "Sweet Potatoes", category: "Vegetables", price: 3.49, unit: "3 lb bag", rating: 4.7, image: "https://images.unsplash.com/photo-1596003906949-67221c37965c?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 65, sales: 22, description: "Nutritious and naturally sweet potatoes, rich in vitamins and excellent for baking or making sweet potato fries." },
  { id: "pd_14", name: "Organic Hass Avocados", category: "Vegetables", price: 4.99, unit: "4 units pack", rating: 4.9, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 95, sales: 72, description: "Creamy and rich organic Hass avocados, perfect for making guacamole, spreading on toast, or slicing onto salads." },
  { id: "pd_15", name: "Red Bell Peppers", category: "Vegetables", price: 2.79, unit: "2 units pack", rating: 4.8, image: "https://images.unsplash.com/photo-1563565312-3aab290ce7aa?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 80, sales: 33, description: "Sweet, thick-walled red bell peppers with a texture that adds crisp freshness, great for stir-fries, fajitas, or dipping." },
  { id: "pd_16", name: "Organic Yellow Onions", category: "Vegetables", price: 2.29, unit: "3 lb bag", rating: 4.6, image: "https://images.unsplash.com/photo-1508747705-3de1064db2a7?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 130, sales: 54, description: "Versatile organic yellow cooking onions, providing a savory depth of flavor to any soup, roast, or stir-fry." },
  { id: "pd_17", name: "Fresh Garlic Bulbs", category: "Vegetables", price: 1.49, unit: "3 pack", rating: 4.7, image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 140, sales: 60, description: "Pungent and flavorful fresh white garlic bulbs, a fundamental ingredient for aromatics and culinary seasoning." },

  // Dairy
  { id: "pd_18", name: "Grass-Fed Whole Milk", category: "Dairy", price: 4.49, unit: "1 gallon bottle", rating: 4.9, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 80, sales: 74, description: "Rich, creamy, and pasteurized milk from pasture-raised, grass-fed cows, offering premium taste and nutrition." },
  { id: "pd_19", name: "Greek Yogurt Plain", category: "Dairy", price: 5.49, unit: "32 oz tub", rating: 4.8, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 45, sales: 30, description: "Thick and strained plain Greek yogurt, packed with protein and active probiotics, ideal for breakfast or parfaits." },
  { id: "pd_20", name: "Cheddar Cheese Block", category: "Dairy", price: 4.99, unit: "8 oz block", rating: 4.7, image: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 70, sales: 35, description: "Medium-aged, sharp yellow cheddar cheese block, perfect for slicing, grating, or building a charcuterie board." },
  { id: "pd_21", name: "Amul Premium Butter", category: "Dairy", price: 3.99, unit: "500 g block", rating: 4.7, image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 110, sales: 50, description: "World-renowned salted premium butter, churned from fresh cream for a smooth spread and excellent baking." },
  { id: "pd_22", name: "Organic Free-Range Eggs", category: "Dairy", price: 5.99, unit: "1 dozen pack", rating: 4.9, image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 95, sales: 88, description: "Grade-A brown eggs laid by free-range hens fed an organic vegetarian diet, featuring deep golden yolks." },
  { id: "pd_23", name: "Sour Cream Premium", category: "Dairy", price: 2.49, unit: "16 oz tub", rating: 4.6, image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 85, sales: 29, description: "Rich, velvety, and tangily fermented premium sour cream, perfect for topping baked potatoes or tacos." },
  { id: "pd_24", name: "Organic Cottage Cheese", category: "Dairy", price: 3.89, unit: "16 oz tub", rating: 4.5, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 60, sales: 18, description: "Curd-rich, low-fat organic cottage cheese, supplying high-quality slow-digesting casein protein." },
  { id: "pd_25", name: "Fresh Mozzarella Balls", category: "Dairy", price: 4.99, unit: "8 oz tub", rating: 4.8, image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 50, sales: 27, description: "Soft, mild, and creamy fresh mozzarella cheese balls in water, perfect for Caprese salad or pizza topping." },

  // Beverages
  { id: "pd_26", name: "Organic Cold Brew Coffee", category: "Beverages", price: 6.49, unit: "32 oz bottle", rating: 4.9, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 50, sales: 40, description: "Smooth, low-acid, and bold cold-brewed coffee made from organic Arabica beans, served unsweetened." },
  { id: "pd_27", name: "100% Pure Orange Juice", category: "Beverages", price: 4.29, unit: "52 oz bottle", rating: 4.7, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 80, sales: 52, description: "Squeezed from peak-season oranges, pasteurized and never from concentrate, packed with vitamin C." },
  { id: "pd_28", name: "Organic Green Tea Bags", category: "Beverages", price: 3.99, unit: "20 tea bags pack", rating: 4.6, image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 100, sales: 25, description: "Premium organic green tea leaves, delicately steamed to lock in antioxidants and a clean, refreshing grassy note." },
  { id: "pd_29", name: "Sparkling Spring Water", category: "Beverages", price: 1.49, unit: "1 liter bottle", rating: 4.8, image: "https://images.unsplash.com/photo-1608885898957-a599fb1698d6?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 200, sales: 110, description: "Naturally carbonated pure spring water with zero calories and zero sweeteners, clean and refreshing." },
  { id: "pd_30", name: "Oatly Oat Milk Original", category: "Beverages", price: 5.29, unit: "64 oz carton", rating: 4.9, image: "https://images.unsplash.com/photo-1596450514735-3165b6bc932a?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 40, sales: 92, description: "Creamy, plant-based oat milk that foams beautifully in lattes and tastes delicious on its own or in cereal." },
  { id: "pd_31", name: "Organic Coconut Water", category: "Beverages", price: 2.99, unit: "33.8 oz carton", rating: 4.7, image: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 90, sales: 45, description: "100% pure coconut water harvested from young green coconuts, packed with natural hydrating electrolytes." },
  { id: "pd_32", name: "Premium Apple Cider", category: "Beverages", price: 4.99, unit: "64 oz jug", rating: 4.8, image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 35, sales: 19, description: "Unfiltered, sweet, and spiced traditional apple cider made from fresh-pressed whole orchard apples." },
  { id: "pd_33", name: "Organic Ginger Kombucha", category: "Beverages", price: 3.79, unit: "16 oz bottle", rating: 4.6, image: "https://images.unsplash.com/photo-1598114858882-0395c4683930?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 60, sales: 24, description: "Probiotic-rich fermented black tea flavored with spicy organic ginger root, crisp and bubbly." },
  { id: "pd_34", name: "Zero Sugar Energy Drink", category: "Beverages", price: 2.49, unit: "16 oz can", rating: 4.5, image: "https://images.unsplash.com/photo-1622543953490-0b700b395ae5?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 150, sales: 85, description: "Sugar-free energy beverage infused with green tea extract, B-vitamins, and natural caffeine for clean focus." },

  // Snacks
  { id: "pd_35", name: "Roasted Salted Almonds", category: "Snacks", price: 7.99, unit: "16 oz bag", rating: 4.8, image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 65, sales: 29, description: "Dry-roasted whole premium almonds seasoned with sea salt, offering a crunchy, protein-rich snack." },
  { id: "pd_36", name: "Kettle Potato Chips Sea Salt", category: "Snacks", price: 3.49, unit: "8 oz bag", rating: 4.7, image: "https://images.unsplash.com/photo-1566478989037-eec170784d20?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 120, sales: 78, description: "Thick-cut, golden kettle-cooked potato chips dusted with pure sea salt for an extra crunchy, classic taste." },
  { id: "pd_37", name: "Dark Chocolate Almond Bar", category: "Snacks", price: 2.99, unit: "3 oz bar", rating: 4.9, image: "https://images.unsplash.com/photo-1549007994-cb92ca85edf6?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 150, sales: 94, description: "Premium 72% dark chocolate bar filled with crunchy roasted almonds and a touch of sea salt." },
  { id: "pd_38", name: "Organic Tortilla Chips", category: "Snacks", price: 3.99, unit: "12 oz bag", rating: 4.6, image: "https://images.unsplash.com/photo-1518047601542-79f18c655718?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 85, sales: 33, description: "Stone-ground organic yellow corn tortilla chips, lightly salted and perfectly sturdy for dipping in salsa or guac." },
  { id: "pd_39", name: "Creamy Peanut Butter", category: "Snacks", price: 4.49, unit: "16 oz jar", rating: 4.8, image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 70, sales: 44, description: "Rich and smooth creamy peanut butter made from USA-grown dry roasted peanuts with no added palm oils." },
  { id: "pd_40", name: "Organic Gummy Bears", category: "Snacks", price: 3.29, unit: "6 oz bag", rating: 4.5, image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 95, sales: 41, description: "Soft, chewy organic gummy candy flavored with real organic fruit juice and zero artificial dyes." },
  { id: "pd_41", name: "Crunchy Mini Pretzels", category: "Snacks", price: 2.89, unit: "16 oz bag", rating: 4.6, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 110, sales: 37, description: "Traditionally baked, crispy, and salty mini pretzel twists, perfect for quick snacking or lunchboxes." },
  { id: "pd_42", name: "Sea Salt Rice Cakes", category: "Snacks", price: 2.49, unit: "4.5 oz pack", rating: 4.4, image: "https://images.unsplash.com/photo-1599307767316-776533aa701b?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 75, sales: 16, description: "Light and airy puffed brown rice cakes, lightly seasoned with sea salt, excellent under spreads." },

  // Electronics
  { id: "pd_43", name: "USB-C Braided Cable", category: "Electronics", price: 9.99, unit: "6 ft cord", rating: 4.8, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 120, sales: 88, description: "Heavy-duty double-braided nylon USB-C to USB-C charging cable supporting up to 60W power delivery and fast sync." },
  { id: "pd_44", name: "Wireless Sport Earbuds", category: "Electronics", price: 29.99, unit: "1 pair", rating: 4.7, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 60, sales: 35, description: "Sweat-resistant wireless Bluetooth sports earbuds with secure-fit ear hooks and deep bass audio signature." },
  { id: "pd_45", name: "Portable Power Bank 10k", category: "Electronics", price: 19.99, unit: "1 unit", rating: 4.9, image: "https://images.unsplash.com/photo-1609592424089-8a19280d5656?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 75, sales: 62, description: "Ultra-slim 10,000mAh external battery charger with dual USB outputs, perfect for high-speed mobile top-ups." },
  { id: "pd_46", name: "Silent Wireless Mouse", category: "Electronics", price: 14.99, unit: "1 unit", rating: 4.6, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 85, sales: 41, description: "Ergonomic 2.4GHz wireless computer mouse featuring silent click technology and adjustable DPI tracking." },
  { id: "pd_47", name: "Fitness Smart Band Pro", category: "Electronics", price: 39.99, unit: "1 unit", rating: 4.7, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 50, sales: 24, description: "Vibrant AMOLED touch display fitness band tracking heart rate, sleep metrics, and offering 30 active workout modes." },
  { id: "pd_48", name: "LED Desk Lamp with USB", category: "Electronics", price: 24.99, unit: "1 unit", rating: 4.8, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=200", storeId: "st_1", stock: 40, sales: 18, description: "Dimmable LED office desk lamp with 5 color temperatures, slide touch brightness, and a built-in USB charging port." },
  { id: "pd_49", name: "Mini Bluetooth Speaker", category: "Electronics", price: 18.49, unit: "1 unit", rating: 4.5, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=200", storeId: "st_2", stock: 90, sales: 53, description: "Pocket-sized waterproof wireless Bluetooth speaker delivering surprisingly loud 360-degree stereo sound." },
  { id: "pd_50", name: "High-Precision Stylus Pen", category: "Electronics", price: 12.99, unit: "1 unit", rating: 4.6, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200", storeId: "st_3", stock: 65, sales: 15, description: "Fine-point universal active capacitive stylus pen, compatible with all iPad and Android touch screens." }
];

export const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const [stores] = useState<Store[]>(defaultStores);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  
  const [orders, setOrders] = useState<Order[]>([
    { id: "SM-9028", customerEmail: "KBK_N@shopmate.com", storeName: "ShopMate Express", date: "Today, 11:24 AM", itemsCount: 3, total: 22.25, status: "Delivered", details: "Avocados, Milk, Butter" },
    { id: "SM-7821", customerEmail: "sharon.jones@gmail.com", storeName: "The Bakery Hub", date: "Yesterday, 3:15 PM", itemsCount: 2, total: 10.48, status: "Delivered", details: "Sourdough, Croissants" }
  ]);
  
  const [customers, setCustomers] = useState<Customer[]>([
    { name: "KBK_N", email: "KBK_N@shopmate.com", phone: "+1 (555) 234-8971", tier: "Gold Shield", ordersCount: 14, totalSpent: 342.50, joinDate: "2026-03-12" },
    { name: "Sharon Jones", email: "sharon.jones@gmail.com", phone: "+1 (555) 890-1122", tier: "Regular", ordersCount: 8, totalSpent: 124.90, joinDate: "2026-04-05" }
  ]);

  const [settings, setSettings] = useState<StoreSettings>({
    storeOpen: true,
    deliveryFee: 1.49,
    platformFee: 0.99,
    supportPhone: "+1 (800) 888-MATE",
    notificationsEnabled: true
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('shopmate_isLoggedIn') === 'true';
  });
  const [customerEmail, setCustomerEmail] = useState<string>(() => {
    return localStorage.getItem('shopmate_customerEmail') || '';
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  const [trackingStep, setTrackingStep] = useState(1);
  const [trackingProgress, setTrackingProgress] = useState(15);
  const [shopperChat, setShopperChat] = useState<Message[]>([
    { sender: 'shopper', text: 'Hi! I am Marcus, your personal shopper. Heading to the aisles now!', time: '5:32 PM' }
  ]);

  // Sync auth state to localStorage
  useEffect(() => {
    localStorage.setItem('shopmate_isLoggedIn', String(isLoggedIn));
    localStorage.setItem('shopmate_customerEmail', customerEmail);
  }, [isLoggedIn, customerEmail]);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setIsLoggedIn(true);
          const email = user.email || user.phoneNumber || '';
          if (email) {
            setCustomerEmail(email);
          }
        }
      });
      return unsubscribe;
    }
  }, []);

  const saveOrUpdateUserInFirestore = async (emailOrPhone: string, name?: string) => {
    if (!firestoreDb) return;
    try {
      const userId = emailOrPhone.replace(/[^a-zA-Z0-9]/g, '_');
      const userRef = doc(firestoreDb, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const cleanName = name || emailOrPhone.split('@')[0] || "Shopper";
        const isEmail = emailOrPhone.includes('@');
        const newUser: Customer = {
          name: cleanName,
          email: isEmail ? emailOrPhone : `${emailOrPhone}@shopmate.com`,
          phone: isEmail ? "+1 (555) 000-0000" : `+1 ${emailOrPhone}`,
          tier: 'Gold Shield',
          ordersCount: 0,
          totalSpent: 0,
          joinDate: new Date().toISOString().split('T')[0]
        };
        await setDoc(userRef, newUser);
      }
    } catch (e) {
      console.warn("Firestore user sync error:", e);
    }
  };

  // Firestore Sync Listeners
  useEffect(() => {
    if (firestoreDb && firebaseAuth) {
      try {
        const unsubP = onSnapshot(collection(firestoreDb, "products"), async (snap) => {
          if (snap.empty || snap.size < 50) {
            console.log("Firestore products count is less than 50. Auto-seeding 50 realistic default products...");
            for (const prod of defaultProducts) {
              try {
                await setDoc(doc(firestoreDb, "products", prod.id), prod);
              } catch (e) {
                console.warn("Error auto-seeding product:", prod.id, e);
              }
            }
          } else {
            const list: Product[] = [];
            snap.forEach(d => {
              const data = d.data();
              
              // Schema Validation: Ignore products missing name, price, image, or description
              if (
                !data ||
                typeof data.name !== 'string' || !data.name.trim() ||
                typeof data.price !== 'number' || isNaN(data.price) ||
                typeof data.image !== 'string' || !data.image.trim() ||
                typeof data.description !== 'string' || !data.description.trim()
              ) {
                console.warn(`Filtering out malformed product document "${d.id}": missing required name, price, image, or description field.`);
                return;
              }
              
              list.push({
                id: d.id,
                name: data.name.trim(),
                category: typeof data.category === 'string' ? data.category : "Produce",
                price: data.price,
                unit: typeof data.unit === 'string' ? data.unit : "1 unit",
                rating: typeof data.rating === 'number' ? data.rating : 5.0,
                image: data.image.trim(),
                storeId: typeof data.storeId === 'string' ? data.storeId : "st_1",
                stock: typeof data.stock === 'number' ? data.stock : 0,
                sales: typeof data.sales === 'number' ? data.sales : 0,
                description: data.description.trim()
              });
            });
            setProducts(list);
          }
        }, (err) => {
          console.warn("Products sync offline:", err.message);
        });

        const unsubO = onSnapshot(collection(firestoreDb, "orders"), (snap) => {
          if (!snap.empty) {
            const list: Order[] = [];
            snap.forEach(d => {
              const data = d.data();
              if (data) {
                const orderId = data.orderId || d.id;
                const userId = data.userId || data.customerEmail || "KBK_N@shopmate.com";
                const total = typeof data.amount === 'number' ? data.amount : (typeof data.total === 'number' ? data.total : 0.0);
                const status = data.status || "Processing";
                const date = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : (data.date || "Today, Just Now");
                
                let details = "";
                let itemsCount = 0;
                if (Array.isArray(data.products)) {
                  details = data.products.map((p: any) => `${p.q || 1}x ${p.name}`).join(', ');
                  itemsCount = data.products.reduce((s: number, p: any) => s + (p.q || 1), 0);
                } else {
                  details = data.details || "";
                  itemsCount = typeof data.itemsCount === 'number' ? data.itemsCount : 1;
                }

                list.push({
                  id: orderId,
                  customerEmail: userId,
                  storeName: data.storeName || "ShopMate Express",
                  date,
                  itemsCount,
                  total,
                  status,
                  details
                });
              }
            });
            setOrders(list);
          }
        }, (err) => {
          console.warn("Orders sync offline:", err.message);
        });

        const unsubC = onSnapshot(collection(firestoreDb, "users"), (snap) => {
          if (!snap.empty) {
            const list: Customer[] = [];
            snap.forEach(d => list.push({ ...(d.data() as Customer) }));
            setCustomers(list);
          }
        }, (err) => {
          console.warn("Customers sync offline:", err.message);
        });

        return () => {
          unsubP();
          unsubO();
          unsubC();
        };
      } catch(e) {
        console.warn("Firestore collection sync error. Active in sandbox mode.");
      }
    }
  }, []);

  // Load user-specific cart & wishlist from Firestore on login
  useEffect(() => {
    if (firestoreDb && customerEmail) {
      const unsubWish = onSnapshot(doc(firestoreDb, "wishlist", customerEmail), (docSnap) => {
        if (docSnap.exists()) {
          setWishlist(docSnap.data().items || []);
        }
      });
      const unsubCart = onSnapshot(doc(firestoreDb, "cart", customerEmail), (docSnap) => {
        if (docSnap.exists()) {
          setCart(docSnap.data().items || []);
        }
      });
      return () => {
        unsubWish();
        unsubCart();
      };
    }
  }, [customerEmail]);

  // Persist wishlist changes to Firestore
  const persistWishlist = async (newWishlist: string[]) => {
    if (firestoreDb && customerEmail) {
      try {
        await setDoc(doc(firestoreDb, "wishlist", customerEmail), { items: newWishlist });
      } catch (e) {
        console.warn("Wishlist persist error:", e);
      }
    }
  };

  // Persist cart changes to Firestore
  const persistCart = async (newCart: CartItem[]) => {
    if (firestoreDb && customerEmail) {
      try {
        await setDoc(doc(firestoreDb, "cart", customerEmail), { items: newCart });
      } catch (e) {
        console.warn("Cart persist error:", e);
      }
    }
  };

  const incrementCartItem = (pid: string) => {
    const prod = products.find(p => p.id === pid);
    if (!prod) return;
    
    setCart(prev => {
      let updated: CartItem[];
      const exists = prev.find(item => item.id === pid);
      if (exists) {
        if (prod.stock > exists.q) {
          updated = prev.map(item => item.id === pid ? { ...item, q: item.q + 1 } : item);
        } else {
          alert("Insufficient stock left!");
          return prev;
        }
      } else {
        updated = [...prev, { id: pid, name: prod.name, price: prod.price, q: 1, image: prod.image, unit: prod.unit }];
      }
      persistCart(updated);
      return updated;
    });
  };

  const decrementCartItem = (pid: string) => {
    setCart(prev => {
      let updated: CartItem[];
      const exists = prev.find(item => item.id === pid);
      if (exists) {
        if (exists.q <= 1) {
          updated = prev.filter(item => item.id !== pid);
        } else {
          updated = prev.map(item => item.id === pid ? { ...item, q: item.q - 1 } : item);
        }
        persistCart(updated);
        return updated;
      }
      return prev;
    });
  };

  const toggleWishlist = (pid: string) => {
    setWishlist(prev => {
      let updated: string[];
      if (prev.includes(pid)) {
        updated = prev.filter(id => id !== pid);
      } else {
        updated = [...prev, pid];
      }
      persistWishlist(updated);
      return updated;
    });
  };

  const addProduct = async (newP: Omit<Product, 'id' | 'sales'>) => {
    const item: Product = { ...newP, id: `pd_${products.length + 1}`, sales: 0 };
    setProducts(prev => [item, ...prev]);

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "products", item.id), item);
      } catch(e) {}
    }
  };

  const editProduct = async (pid: string, fields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === pid ? { ...p, ...fields } : p));
    
    if (firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, "products", pid), fields);
      } catch(e) {}
    }
  };

  const deleteProduct = async (pid: string) => {
    setProducts(prev => prev.filter(p => p.id !== pid));

    if (firestoreDb) {
      try {
        await deleteDoc(doc(firestoreDb, "products", pid));
      } catch(e) {}
    }
  };

  const placeOrder = async (details: string, address: string, payment: string, total: number) => {
    const orderId = `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = customerEmail || "KBK_N@shopmate.com";
    
    // Map cart items for the "products" array in the order document
    const productsList = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      q: item.q,
      unit: item.unit,
      image: item.image
    }));

    const firestoreOrderDoc = {
      orderId,
      userId,
      products: productsList,
      amount: total,
      status: "Processing",
      createdAt: new Date().toISOString(),
      address,
      paymentMethod: payment,
      storeName: "ShopMate Express",
      details
    };

    const newOrder: Order = {
      id: orderId,
      customerEmail: userId,
      storeName: "ShopMate Express",
      date: "Today, Just Now",
      itemsCount: cart.reduce((s,i)=>s+i.q, 0),
      total,
      status: "Processing",
      details
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Subtract catalog stocks
    cart.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.id) {
          const updatedStock = Math.max(0, p.stock - item.q);
          const updatedSales = p.sales + item.q;
          if (firestoreDb) {
            updateDoc(doc(firestoreDb, "products", p.id), { stock: updatedStock, sales: updatedSales });
          }
          return { ...p, stock: updatedStock, sales: updatedSales };
        }
        return p;
      }));
    });

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "orders", orderId), firestoreOrderDoc);
        await setDoc(doc(firestoreDb, "cart", userId), { items: [] });
      } catch(e) {
        console.warn("Firestore placeOrder write error:", e);
      }
    }

    setCart([]);
    setTrackingStep(1);
    setTrackingProgress(15);
  };

  const createPaymentRecord = async (paymentId: string, orderId: string, amount: number, status: 'success' | 'failed') => {
    if (!firestoreDb) return;
    try {
      const paymentData = {
        paymentId,
        orderId,
        userId: customerEmail || "KBK_N@shopmate.com",
        amount,
        status,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestoreDb, "payments", paymentId), paymentData);
      console.log(`Payment record ${paymentId} saved in Firestore with status: ${status}`);
    } catch (e) {
      console.warn("Error saving payment to Firestore:", e);
    }
  };

  const createOrderAfterPayment = async (orderId: string, details: string, address: string, paymentMethod: string, total: number) => {
    const userId = customerEmail || "KBK_N@shopmate.com";
    
    // Map cart items for the "products" array in the order document
    const productsList = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      q: item.q,
      unit: item.unit,
      image: item.image
    }));

    const firestoreOrderDoc = {
      orderId,
      userId,
      products: productsList,
      amount: total,
      status: "Processing",
      createdAt: new Date().toISOString(),
      address,
      paymentMethod,
      storeName: "ShopMate Express",
      details
    };

    const newOrder: Order = {
      id: orderId,
      customerEmail: userId,
      storeName: "ShopMate Express",
      date: "Today, Just Now",
      itemsCount: cart.reduce((s,i)=>s+i.q, 0),
      total,
      status: "Processing",
      details
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    // Subtract catalog stocks
    cart.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.id) {
          const updatedStock = Math.max(0, p.stock - item.q);
          const updatedSales = p.sales + item.q;
          if (firestoreDb) {
            updateDoc(doc(firestoreDb, "products", p.id), { stock: updatedStock, sales: updatedSales });
          }
          return { ...p, stock: updatedStock, sales: updatedSales };
        }
        return p;
      }));
    });

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, "orders", orderId), firestoreOrderDoc);
        await setDoc(doc(firestoreDb, "cart", userId), { items: [] });
      } catch(e) {
        console.warn("Firestore order write error post-payment:", e);
      }
    }

    setCart([]);
    setTrackingStep(1);
    setTrackingProgress(15);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status: newStatus } : null);
      
      if (newStatus === 'Processing') {
        setTrackingStep(2);
        setTrackingProgress(45);
      } else if (newStatus.includes('Dispatched')) {
        setTrackingStep(3);
        setTrackingProgress(75);
      } else if (newStatus.includes('Refunded') || newStatus.includes('Delivered')) {
        setTrackingStep(4);
        setTrackingProgress(100);
      }
    }

    if (firestoreDb) {
      try {
        updateDoc(doc(firestoreDb, "orders", orderId), { status: newStatus });
      } catch(e) {}
    }
  };

  return (
    <ShopContext.Provider value={{
      stores,
      products,
      orders,
      customers,
      settings,
      isLoggedIn,
      customerEmail,
      cart,
      wishlist,
      activeOrder,
      trackingStep,
      trackingProgress,
      shopperChat,
      setCustomerEmail,
      setIsLoggedIn,
      incrementCartItem,
      decrementCartItem,
      toggleWishlist,
      addProduct,
      editProduct,
      deleteProduct,
      placeOrder,
      updateOrderStatus,
      setSettings,
      setShopperChat,
      setTrackingStep,
      setTrackingProgress,
      setActiveOrder,
      setCart,
      saveOrUpdateUserInFirestore,
      createPaymentRecord,
      createOrderAfterPayment
    }}>
      {children}
    </ShopContext.Provider>
  );
};
