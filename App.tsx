import './global.css'
import TaskListHub from './components/TaskListHub';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider className="flex">
      <TaskListHub/>
    </SafeAreaProvider>
  );
}
