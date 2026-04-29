// screens/ProductsScreen.js
import React, { useState, useMemo, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Alert,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { PRODUCTS } from "../data/products";

// Komponen ProductCardGrid yang dioptimasi dengan React.memo
const ProductCardGrid = memo(({ item, onPress }) => (
  <TouchableOpacity 
    style={gridStyles.card} 
    onPress={() => onPress(item)} 
    activeOpacity={0.85}
  >
    <Text style={gridStyles.emoji}>{item.image}</Text>
    <Text style={gridStyles.name} numberOfLines={2}>{item.name}</Text>
    <Text style={gridStyles.price}>
      Rp {item.price.toLocaleString('id-ID')}
    </Text>
  </TouchableOpacity>
));

// Tinggi rata-rata satu baris di grid (card + margin)
const ROW_HEIGHT = 160;

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setPage(1);
    }, 1500);
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return query
      ? PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        )
      : PRODUCTS;
  }, [searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const handleLoadMore = () => {
    if (isLoadingMore || displayedProducts.length >= filteredProducts.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 800);
  };

  // Optimasi: Stabilkan fungsi onPress agar ProductCard tidak re-render
  const handleProductPress = useCallback((product) => {
    Alert.alert(
      product.name,
      `Harga: Rp ${product.price.toLocaleString("id-ID")}`
    );
  }, []);

  // Optimasi: Beritahu FlatList layout item (Grid 2 Kolom)
  const getItemLayout = useCallback((data, index) => ({
    length: ROW_HEIGHT,
    offset: ROW_HEIGHT * Math.floor(index / 2),
    index,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Toko Kita</Text>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk atau kategori..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setPage(1);
            }}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Text 
              style={styles.clearButton} 
              onPress={() => {
                setSearchQuery("");
                setPage(1);
              }}
            >
              ✕
            </Text>
          )}
        </View>
        <Text style={styles.resultInfo}>
          {searchQuery
            ? `${filteredProducts.length} hasil untuk "${searchQuery}"`
            : `${PRODUCTS.length} produk tersedia`}
        </Text>
      </View>

      <FlatList
        data={displayedProducts}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <ProductCardGrid item={item} onPress={handleProductPress} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        
        // --- PROPS OPTIMASI ---
        getItemLayout={getItemLayout}
        initialNumToRender={6}
        removeClippedSubviews={true} 
        
        ListFooterComponent={() => (
          isLoadingMore ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#9ca3af' }}>Memuat lebih banyak...</Text>
            </View>
          ) : null
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              Produk "{searchQuery}" tidak ditemukan
            </Text>
            <Text style={styles.emptyHint}>Coba kata kunci lain</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#111827' },
  clearButton: { fontSize: 14, color: '#9ca3af', paddingHorizontal: 8, paddingVertical: 4 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  resultInfo: { fontSize: 12, color: '#6b7280' },
  listContent: { paddingVertical: 12, paddingBottom: 32 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#374151', fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  emptyHint: { fontSize: 13, color: '#9ca3af' },
});

const gridStyles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  emoji: { fontSize: 40, marginBottom: 10 },
  name: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#111827', 
    textAlign: 'center', 
    marginBottom: 8, 
    lineHeight: 18 
  },
  price: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
});