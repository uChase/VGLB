export default function getTldrColor(category, value) {
  let color;

  switch (category) {
    case "Gameplay":
    case "Graphics":
    case "Story":
    case "Difficulty":
    case "Game-Time":
      switch (value) {
        case "Masterpiece":
        case "Beautiful":
        case "Lovely":
        case "Challenging":
        case "Endless":
          color = "#3B82F6"; // Tailwind's text-blue-500
          break;
        case "Good":
        case "Long":
        case "Difficult":
        case "Depends on you":
          color = "#059669"; // Tailwind's text-green-600
          break;
        case "Nothing special":
        case "Will do":
        case "Average":
          color = "#F59E0B"; // Tailwind's text-yellow-500
          break;
        case "Bad":
        case "Not great":
        case "Dark Souls":
        case "Depends on you":
        case "Easy":
        case "Short":
          color = "#A33A13"; // Tailwind's text-yellow-900
          break;
        case "Unplayable":
        case "Boring":
        case "Awful":
        case "Snooze":
          color = "#991B1B"; // Tailwind's text-red-600
          break;
        default:
          color = "black";
      }
      break;
    case "Price":
      switch (value) {
        case "Just buy it":
          color = "#3B82F6"; // Tailwind's text-blue-500
          break;
        case "Worth the price":
          color = "#059669"; // Tailwind's text-green-600
          break;
        case "Wait for sale":
          color = "#B45309"; // Tailwind's text-yellow-700
          break;
        case "Maybe 1¢":
          color = "#991B1B"; // Tailwind's text-red-600
          break;
        case "Free":
          color = "#60A5FA"; // Tailwind's text-blue-400
          break;
        default:
          color = "black";
      }
      break;
    default:
      color = "black";
  }
  return color;
}
