import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { getItem, setItem } from '../util/AsyncStorage';
import { Task } from '../types/Task';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import TodoGestureDetector from './TodoGestureDetector';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TodoList() {
  // State Hooks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getItem('tasks').then((item: Task[]) => {
      setTasks(item || []);
    });
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

  // Function to Toggle Task Completion
  function updateText(id: number, text: string) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, text } : task)));
  }

  // Render TodoList Component
  return (
    <SafeAreaView className="grow bg-white"  style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <KeyboardAvoidingView
          behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
          style={{ flex: 1 }}
          enabled
          keyboardVerticalOffset={Platform.select({ios: 80, android: 500})}
        >
          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            style={{ flexGrow: 1 }}
          >
            {tasks.map(task => (
              <TodoGestureDetector
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                toggleCompleted={toggleCompleted}
              />
            ))}
          </ScrollView>
          <View className="flex flex-row align-middle bg-white p-2 border-solid border-0 border-t border-gray-300">
            <View className="flex-1">
              <TextInput
                value={text}
                onChangeText={setText}
                onSubmitEditing={addTask}
                placeholder="New Task"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </View>
            <TouchableOpacity className="font-black items-center bg-blue-500 ml-2 border-none rounded-[50%] h-[42px] w-[42px] cursor-pointer" onPress={addTask}>
              <View className="absolute top-[50%] w-[100%] -translate-y-[50%]">
                <FontAwesome5
                  name='plus'
                  size={18}
                  color='white'
                  className="text-center"
                />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}