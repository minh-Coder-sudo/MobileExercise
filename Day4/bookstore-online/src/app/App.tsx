// GIỜ 4 — Layout toàn màn hình: ScrollView & SafeAreaView
// Minh hoạ HomeScreen, BookDetailScreen và CartScreen bằng useState.
import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './screens/HomeScreen';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { TabBar, TabKey } from './components/TabBar';
import { BOOKS, CART_ITEMS, CartItem } from '../../data';

export default function App() {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) ?? null;

  const handleOpenCart = () => {
    setSelectedBookId(null);
    setShowCart(true);
    setActiveTab('cart');
  };

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'home') {
      setSelectedBookId(null);
      setShowCart(false);
      setActiveTab('home');
    }

    if (tab === 'cart') {
      handleOpenCart();
    }
  };
  const handleAddToCart = (bookId: number) => {
    const book = BOOKS.find((b) => b.id === bookId);
  
    if (!book) return;
  
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.book.id === bookId
      );
  
      // Nếu sách đã có trong giỏ -> tăng quantity
      if (existingItem) {
        return currentItems.map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
  
      // Nếu chưa có -> thêm sản phẩm mới
      return [
        ...currentItems,
        {
          book,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        {showCart ? (
          <CartScreen items={cartItems} />
        ) : selectedBook ? (
          <BookDetailScreen
            book={selectedBook}
            onBack={() => setSelectedBookId(null)}
            onAddToCart={() => handleAddToCart(selectedBook.id)}
          />
        ) : (
          <HomeScreen
            cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            onPressBook={(id) => {
              setSelectedBookId(id);
              setActiveTab('home');
            }}
            onPressCart={handleOpenCart}
          />
        )}
      </View>
      {!selectedBook && (
        <TabBar active={showCart ? 'cart' : activeTab} onChange={handleTabChange} />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1 },
});
