import './global.css'
import TodoList from './components/TodoList';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider className="flex">
      <TodoList/>
    </SafeAreaProvider>
  );
}
