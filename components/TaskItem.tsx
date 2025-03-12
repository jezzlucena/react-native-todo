import BouncyCheckbox from "react-native-bouncy-checkbox";
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Task } from '../types/Task';
import AutoSizeTextInput from "./AutoSizeTextInput";
import { FontAwesome5 } from "@expo/vector-icons";

interface IProps {
  task: Task;
  toggleCompleted: (id: number) => void;
  updateText: (id: number, text: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const TaskItem = ({
  task,
  toggleCompleted,
  updateText,
  onSubmit,
  onBlur,
  onFocus
}: IProps) => {
  const handleChangeText = (text: string) => {
    updateText(task.id, text);
  };

  return (
    <View className="relative flex flex-row items-start align-top pl-5 bg-white">
      <BouncyCheckbox
        fillColor="rgb(59 130 246)"
        isChecked={task.completed}
        onPress={() => toggleCompleted(task.id)}
        className="w-[40px] mt-5"
        size={22}
      />
      <View className="flex-1 flex flex-row text-wrap flex-wrap break-words border-b border-solid border-gray-200">
        <AutoSizeTextInput
          className={"focus:outline-none w-[100%] py-4 pr-12 text-gray-700 text-lg border-none bg-transparent " + (task.completed ? "line-through" : "")}
          value={task.text}
          onChangeText={handleChangeText}
          onSubmit={onSubmit}
          onBlur={onBlur}
          focusOnMount={task.focusOnMount}
          onFocus={onFocus}
        />
      </View>
      <FontAwesome5
        name='grip-vertical'
        size={18}
        color='gray'
        className="absolute top-[50%] right-0 -mt-3 text-center w-[45px] text-gray-500"
      />
    </View>
  )
};

export default TaskItem;