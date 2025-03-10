import BouncyCheckbox from "react-native-bouncy-checkbox";
import React from 'react';
import { View } from 'react-native';
import { Task } from '../types/Task';
import { Text } from "react-native-gesture-handler";

interface IProps {
  task: Task,
  toggleCompleted: (id: number) => void,
}

const TodoItem: React.FC<IProps> = ({ task, toggleCompleted }) => {
  return (
    <View className="flex flex-row items-start align-top pl-3 bg-white">
      <BouncyCheckbox
        fillColor="rgb(59 130 246)"
        isChecked={task.completed}
        onPress={() => toggleCompleted(task.id)}
        className="w-[42px] mt-4"
        size={26}
      />
      <View className="flex-1 text-wrap flex-wrap break-words border-b border-solid border-gray-300">
        <Text
          className={"w-[100%] my-4 pr-2 text-gray-700 text-lg border-none bg-transparent " + (task.completed ? "line-through" : "")}
        >
          { task.text }
        </Text>
      </View>
    </View>
  )
};

export default TodoItem;