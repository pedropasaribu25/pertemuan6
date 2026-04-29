// App.js — Main navigation hub
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ProductsScreen from "./screens/ProductsScreen";
import ContactsScreen from "./screens/ContactsScreen";

export default function App() {
  // State: track mana tab yang aktif
  const [activeTab, setActiveTab] = useState("products");

  return (
    <View style={styles.container}>
      {/* Render screen yang sesuai berdasarkan activeTab */}
      {activeTab === "products" ? <ProductsScreen /> : <ContactsScreen />}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Tab 1: Products */}
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === "products" && styles.navButtonActive,
          ]}
          onPress={() => setActiveTab("products")}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>🛍️</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "products" && styles.navLabelActive,
            ]}
          >
            Produk
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Contacts */}
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === "contacts" && styles.navButtonActive,
          ]}
          onPress={() => setActiveTab("contacts")}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📇</Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "contacts" && styles.navLabelActive,
            ]}
          >
            Kontak
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 8,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  navButtonActive: {
    backgroundColor: "#f9fafb",
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
  },
  navLabelActive: {
    color: "#6366f1",
  },
});