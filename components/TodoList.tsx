import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import TodoItem from './TodoItem';

export default function TodoList() {
  // State Hooks
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Doctor Appointment', completed: true },
    { id: 2, text: 'Meeting at School', completed: false },
  ]);
  const [text, setText] = useState('');
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
    <View>
      {tasks.map(task => (
        <TodoItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompleted}
        />
      ))}
      <View className="flex flex-row">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="New Task"
          className="grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <TouchableOpacity className="bg-blue-500 py-3 px-2 ml-1 border-none rounded cursor-pointer text-xs align-middle" onPress={addTask}>
          <Text className="text-white align-middle">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}