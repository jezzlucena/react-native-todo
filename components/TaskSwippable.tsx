import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import TaskItem from "./TaskItem";
import { View, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Task } from "../types/Task";
import { useState } from "react";


const WIDTH_SCREEN = Dimensions.get('window').width;

interface IProps {
  task: Task;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
  updateText: (id: number, text: string) => void;
  onSubmit: () => void;
  scrollViewRef?: React.RefObject<ScrollView>;
};

const TaskSwippable: React.FC<IProps> = ({
  task,
  deleteTask,
  toggleCompleted,
  updateText,
  onSubmit,
  scrollViewRef
 }) => {
  const [layoutY, setLayoutY] = useState(0);
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
      const isShouldDismiss = swipeTranslateX.value < -WIDTH_SCREEN * 0.5;
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
      opacity: swipeTranslateX.value / (-WIDTH_SCREEN * 0.5)
  }));

  const handleSubmit = () => {
    if (task.text !== '') {
      onSubmit();
    } else {
      deleteTask(task.id);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutY(event.nativeEvent.layout.y);
  };

  const handleFocus = () => {
    scrollViewRef?.current?.scrollTo({ x: 0, y: layoutY, animated: true });
  };

  const handleBlur = () => {
    if (task.text === '') {
      deleteTask(task.id);
    }
  };
  
  return (
    <View onLayout={handleLayout}>
      <GestureDetector gesture={pan}>
          <Animated.View style={[styles.itemContainer]}>
              <Animated.View style={[styles.iconContainer, opacityStyle]}>
                <View className="absolute top-[50%] right-0 w-[60px] -translate-y-[50%]">
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
                <TaskItem
                  task={task}
                  toggleCompleted={toggleCompleted}
                  updateText={updateText}
                  onSubmit={handleSubmit}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Animated.View>
          </Animated.View>
      </GestureDetector>
    </View>
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
    width: "100%",
    backgroundColor: 'red'
  },
  itemContainer: {
    width: "100%",
    overflow: "hidden"
  }
})

export default TaskSwippable;