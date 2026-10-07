import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import OrdersScreen from '../screens/OrdersScreen';
import CartScreen from '../screens/CartScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import DealerDashboardScreen from '../screens/DealerDashboardScreen';
import PlumberDashboardScreen from '../screens/PlumberDashboardScreen';
import DealerProductsScreen from '../screens/DealerProductsScreen';
import PlumberOrdersScreen from '../screens/PlumberOrdersScreen';
import PlumberOrderDetailsScreen from '../screens/PlumberOrderDetailsScreen';
import PlumberProfileScreen from '../screens/PlumberProfileScreen';
import PlumberNotificationsScreen from '../screens/PlumberNotificationsScreen';
import PlumberActivitiesScreen from '../screens/PlumberActivitiesScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Orders',
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);
  const role = user?.role;

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator>
          {role === 'CUSTOMER' && (
            <>
              <Stack.Screen
                name="CustomerApp"
                component={CustomerTabs}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="ProductList"
                component={ProductListScreen}
                options={{ title: 'Products' }}
              />

              <Stack.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
                options={{ title: 'Product Details' }}
              />

              <Stack.Screen
                name="OrderDetails"
                component={OrderDetailsScreen}
                options={{ title: 'Order Details' }}
              />

              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{ title: 'Checkout' }}
              />
            </>
          )}

          {role === 'DEALER' && (
            <>
              <Stack.Screen
                name="DealerDashboard"
                component={DealerDashboardScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="DealerProducts"
                component={DealerProductsScreen}
                options={{ title: 'Products' }}
              />

              <Stack.Screen
                name="DealerProductDetails"
                component={ProductDetailsScreen}
                options={{ title: 'Product Details' }}
              />

              <Stack.Screen
                name="DealerCart"
                component={CartScreen}
                options={{ title: 'Cart' }}
              />

              <Stack.Screen
                name="DealerCheckout"
                component={CheckoutScreen}
                options={{ title: 'Checkout' }}
              />
            </>
          )}

          {role === 'PLUMBER' && (
            <>
              <Stack.Screen
                name="PlumberDashboard"
                component={PlumberDashboardScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="PlumberOrders"
                component={PlumberOrdersScreen}
                options={{ title: 'Orders' }}
              />

              <Stack.Screen
                name="PlumberOrderDetails"
                component={PlumberOrderDetailsScreen}
                options={{ title: 'Order Details' }}
              />

              <Stack.Screen
                name="PlumberProfile"
                component={PlumberProfileScreen}
                options={{ title: 'Profile' }}
              />

              <Stack.Screen
                name="PlumberNotifications"
                component={PlumberNotificationsScreen}
                options={{ title: 'Notifications' }}
              />

              <Stack.Screen
                name="PlumberActivities"
                component={PlumberActivitiesScreen}
                options={{ title: 'Assigned Activities' }}
              />
            </>
          )}

          {role === 'ADMIN' && (
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Otp"
            component={OtpScreen}
            options={{
              title: 'Verify OTP',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
