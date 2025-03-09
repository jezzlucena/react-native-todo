import { View } from 'react-native';
import './global.css'
import TodoList from './components/TodoList';

export default function App() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <TodoList />
    </View>
  );
}
