import { Color } from '../types/Color'

export const getRandomColor: Color = () => {
  const lowComponent = Math.round(Math.random() * 50);
  const midComponent = Math.round(Math.random() * 150);
  const highComponent = Math.round(Math.random() * 255);

  const components = [
    { value: lowComponent, sortFactor: Math.random() },
    { value: midComponent, sortFactor: Math.random() },
    { value: highComponent, sortFactor: Math.random() },
  ];

  components.sort((a, b) => {
    return a.sortFactor - b.sortFactor;
  });

  return `rgb(${components[0].value}, ${components[1].value}, ${components[2].value})`;
};