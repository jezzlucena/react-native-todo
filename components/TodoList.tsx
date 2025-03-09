import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Keyboard, KeyboardEvent, EmitterSubscription } from 'react-native';
import TodoItem from './TodoItem';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getItem, setItem } from '../util/AsyncStorage';
import { Task } from '../types/Task';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodoList() {
  // State Hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event: KeyboardEvent) => setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef<EmitterSubscription>();
  const keyboardDidHideListener = useRef<EmitterSubscription>();

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener('keyboardWillShow', onKeyboardShow);
    keyboardDidHideListener.current = Keyboard.addListener('keyboardWillHide', onKeyboardHide);

    getItem('tasks').then((item: Task[]) => {
      setTasks(item || []);
    });

    return () => {
      keyboardDidShowListener.current?.remove();
      keyboardDidHideListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    setItem('tasks', tasks);
  }, [tasks]);

  // Function to Add Task
  function addTask() {
    const newTask = { id: Date.now(), text, completed: false };
    setTasks([...tasks, newTask]);
    setText('');
  }

  // Function to Delete Task
  function deleteTask(id: number) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  // Function to Toggle Task Completion
  function toggleCompleted(id: number) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  // Render TodoList Component
  return (
    <SafeAreaView className="flex-1 w-[100%]">
      <View className="absolute top-0 right-0 left-0 bottom-0 p-4 flex flex-col">
        <KeyboardAwareScrollView className="grow">
          {tasks.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
            />
          ))}
        </KeyboardAwareScrollView>
        <KeyboardAvoidingView className="flex flex-row bg-white pt-2 border-solid border-0 border-t border-gray-500" style={{ marginBottom: keyboardOffset }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="New Task"
            className="grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <TouchableOpacity className="bg-blue-500 py-3 px-2 ml-1 border-none rounded-lg cursor-pointer text-xs align-middle" onPress={addTask}>
            <Text className="text-white align-middle">Add</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}