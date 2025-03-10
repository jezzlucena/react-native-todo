import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import TodoItem from "./TodoItem";
import { View, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Task } from "../types/Task";
import { useState } from "react";


const WIDTH_SCREEN = Dimensions.get('window').width;
const ITEM_HEIGHT = 100;

interface IFieldSwipe {
  task: Task;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
};

const TodoGestureDetector: React.FC<IFieldSwipe> = ({ task, deleteTask, toggleCompleted }) => {
  const swipeTranslateX = useSharedValue(0);
  const pressed = useSharedValue(false);

  const pan = Gesture.Pan()
    .activateAfterLongPress(500)
    .onStart(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      if (event.translationX < 0) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onFinalize(() => {
      const isShouldDismiss = swipeTranslateX.value < -WIDTH_SCREEN * 0.3
      if (isShouldDismiss) {
        swipeTranslateX.value = withTiming(-WIDTH_SCREEN, undefined, (isDone) => {
          if (isDone) {
            runOnJS(deleteTask)(task.id)
          }
        })
      } else {
        swipeTranslateX.value = withSpring(0);
      }
      pressed.value = false
    })

  const transformStyle = useAnimatedStyle(() => ({
      transform: [
          { translateX: swipeTranslateX.value },
          { scale: withTiming(pressed.value ? 1.15 : 1) },
      ],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
      opacity: swipeTranslateX.value / (-WIDTH_SCREEN * 0.3)
  }));
  
  return (
    <GestureDetector gesture={pan}>
        <Animated.View style={[styles.itemContainer]}>
            <Animated.View style={[styles.iconContainer, opacityStyle]}>
              <View className="absolute top-[50%] w-[100%] -translate-y-[50%]">
                <FontAwesome5
                  name='trash'
                  size={25}
                  color='white'
                  className="text-center"
                />
              </View>
            </Animated.View>
            <Animated.View
              style={[styles.todoContainer, transformStyle]}
            >
              <TodoItem
                task={task}
                toggleCompleted={toggleCompleted}
              />
            </Animated.View>
        </Animated.View>
    </GestureDetector>
  )
};

const styles = StyleSheet.create({
  todoContainer: {
    width: "100%"
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'red'
  },
  itemContainer: {
    width: "100%",
    overflow: "hidden"
  }
})

export default TodoGestureDetector;