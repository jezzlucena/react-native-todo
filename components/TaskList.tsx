import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { getItem, setItem } from '../util/AsyncStorage';
import { Task } from '../types/Task';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import TaskSwippable from './TaskSwippable';
import { FontAwesome5 } from '@expo/vector-icons';
import AutoSizeTextInput from './AutoSizeTextInput';
import { TaskGroup } from '../types/TaskGroup';

interface IProps {
  activeGroup: TaskGroup,
  updateGroup: (id: number, name: string, tasks: Task[]) => void,
  deleteGroup: (id: number) => void,
  goBack: () => void,
}

const TaskList = ({ activeGroup, updateGroup, deleteGroup, goBack }: IProps) => {
  // State Hooks
  const [tasks, setTasks] = useState<Task[]>(activeGroup.tasks);
  const [name, setName] = useState(activeGroup.name);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    updateGroup(activeGroup.id, activeGroup.name, tasks)
  }, [tasks]);

  // Function to Add Task
  const addTask = (text: string) => {
    const newTask: Task = { id: Date.now(), text, completed: false, focusOnMount: true };
    setTasks([...tasks, newTask]);
    setInputText('');
  };

  // Function to Delete Task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Function to Toggle Task Completion
  const toggleCompleted = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  // Function to Toggle Task Completion
  const updateText = (id: number, text: string) => {
    const focusOnMount = text === '';
    setTasks(tasks.map(task => (task.id === id ? { ...task, text, focusOnMount } : task)));
  };

  const handleSubmit = () => {
    addTask(inputText);
    setInputText('');
  };

  const handleItemSubmit = () => {
    addTask('');
  };

  const handleChangeName = (value: string) => {
    setName(value);
    updateGroup(activeGroup.id, value, tasks);
  };

  // Render TodoList Component
  return (
    <KeyboardAvoidingView
      behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
      className="bg-white"
      style={{ flex: 1 }}
      enabled
      keyboardVerticalOffset={Platform.select({ios: 80, android: 500})}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flexGrow: 1 }}
      >
        <TouchableOpacity
          className="flex flex-row mt-2 font-black items-center color-gray-900 ml-2 border-none cursor-pointer"
          onPress={goBack}
        >
          <FontAwesome5
            name='chevron-left'
            size={18}
            className="mx-2"
          />
          <Text
            className="text-xl font-bold"
          >My Lists</Text>
        </TouchableOpacity>
        <AutoSizeTextInput
          className="text-4xl font-bold mt-4 ml-4 mb-2"
          value={name}
          onChangeText={handleChangeName}
          style={{ color: activeGroup.color }}
        />
        {tasks.map(task => (
          <TaskSwippable
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
            updateText={updateText}
            onSubmit={handleItemSubmit}
            scrollViewRef={scrollViewRef}
          />
        ))}
      </ScrollView>
      <View className="flex flex-row align-middle bg-white p-2 border-solid border-0 border-t border-gray-300">
        <View className="flex-1">
          <AutoSizeTextInput
            value={inputText}
            className="text-sm p-2.5 block bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChangeText={setInputText}
            onSubmit={handleSubmit}
            placeholder="New Reminder"
          />
        </View>
        <TouchableOpacity
          className="font-black items-center bg-blue-500 ml-2 border-none rounded-[50%] h-[42px] w-[42px] cursor-pointer"
          onPress={handleSubmit}
          style={{ backgroundColor: activeGroup.color }}
        >
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
  );
}

export default TaskList;