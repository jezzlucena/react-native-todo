import CheckBox from 'expo-checkbox';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '../types/Task';

interface Props {
  task: Task,
  deleteTask: (id: number) => void,
  toggleCompleted: (id: number) => void
}

const TodoItem: React.FC<Props> = ({ task, deleteTask, toggleCompleted }) => {
  return (
    <View className="flex flex-row justify-between items-center mb-2 p-2 border border-solid border-gray-300 rounded">
      <CheckBox
        value={task.completed}
        onValueChange={() => toggleCompleted(task.id)}
      />
      <View className="flex-1 grow mx-2">
        <Text className={"text-gray-700 " + (task.completed ? "line-through text-gray-500" : "")}>
          {task.text}
        </Text>
      </View>
      <TouchableOpacity className="bg-red-500 py-1 px-2 border-none rounded cursor-pointer text-xs" onPress={() => deleteTask(task.id)}>
        <Text className="text-white">X</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TodoItem;