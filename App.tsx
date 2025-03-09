import { View } from 'react-native';
import './global.css'
import TodoList from './components/TodoList';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <TodoList />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
