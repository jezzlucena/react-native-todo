import { useEffect, useState } from "react";
import { Task } from "../types/Task";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { getItem, setItem } from "../util/AsyncStorage";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AutoSizeTextInput from "./AutoSizeTextInput";
import { getRandomColor } from "../util/RandomColor";
import TaskList from "./TaskList";
import { TaskGroup } from "../types/TaskGroup";

export default function TaskListHub() {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<TaskGroup | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputColor, setInputColor] = useState(getRandomColor());

  useEffect(() => {
    getItem('taskLists').then((taskLists: TaskGroup[]) => {
      setTaskGroups(taskLists || []);
    });
  }, []);

  useEffect(() => {
    setItem('taskLists', taskGroups);
  }, [taskGroups]);

  // Function to Add Task
  const addTaskGroup = (name: string) => {
    const newTaskGroup: TaskGroup = { id: Date.now(), name, tasks: [], color: inputColor };
    setTaskGroups([...taskGroups, newTaskGroup]);
    setInputText('');
    setInputColor(getRandomColor());
    setActiveGroup(newTaskGroup);
  };

  // Function to Delete Task
  const deleteGroup = (id: number) => {
    setTaskGroups(taskGroups.filter(group => group.id !== id));
  };

  // Function to Toggle Task Completion
  const updateGroup = (id: number, name: string, tasks: Task[]) => {
    console.log(id, name, tasks)
    setTaskGroups(taskGroups.map(group => (group.id === id ? { ...group, name, tasks } : group)));
  };

  const handleSubmit = () => {
    if (!inputText) return;

    addTaskGroup(inputText);
    setInputText('');
  };

  // Render TodoList Component
  return (
    <SafeAreaView className={"grow bg-gray-100 " + (activeGroup ? "bg-white" : "")}  style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <KeyboardAvoidingView
          behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
          style={{ flex: 1 }}
          enabled
          keyboardVerticalOffset={Platform.select({ios: 80, android: 500})}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flexGrow: 1 }}
          >
            <Text
              className="text-2xl font-bold text-gray-700 my-2 ml-4"
            >
              My Lists
            </Text>
            <View className="bg-white mx-2 rounded-[10px]">
              {taskGroups.map(group => (
                <TouchableOpacity
                  className="font-black ml-2 border-none cursor-pointer"
                  onPress={() => setActiveGroup(group)}
                  key={group.id}
                >
                  <View className="flex flex-row border-b p-2 border-solid border-gray-200">
                    <Text
                      className="grow text-lg pr-8"
                      style={{ color: group.color }}
                    >
                      {group.name}
                    </Text>
                    <FontAwesome5
                      name='chevron-right'
                      size={18}
                      className="absolute top-[50%] right-0 -mt-1 text-center w-[45px] text-gray-500"
                      style={{ color: group.color }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View className="flex flex-row align-middle p-2 border-solid">
            <View className="flex-1">
              <AutoSizeTextInput
                value={inputText}
                className="text-sm p-2.5 block width-[100%] bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChangeText={setInputText}
                placeholder="New List"
                onSubmit={handleSubmit}
              />
            </View>
            <TouchableOpacity
              className="font-black items-center ml-2 border-none rounded-[50%] h-[42px] w-[42px] cursor-pointer"
              onPress={handleSubmit}
              style={{ backgroundColor: inputColor }}
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
            <TouchableOpacity
              className="font-black items-center ml-2 border-none rounded-[50%] h-[42px] w-[42px] cursor-pointer"
              onPress={() => setInputColor(getRandomColor())}
              style={{ backgroundColor: inputColor }}
            >
              <View className="absolute top-[50%] w-[100%] -translate-y-[50%]">
                <FontAwesome5
                  name='paint-brush'
                  size={18}
                  color='white'
                  className="text-center"
                />
              </View>
            </TouchableOpacity>
          </View>

          {activeGroup && (
            <View className="absolute top-0 left-0 w-[100%] h-[100%]">
              <TaskList
                activeGroup={activeGroup}
                updateGroup={updateGroup}
                deleteGroup={deleteGroup}
                goBack={() => setActiveGroup(null)}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

