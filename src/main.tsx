import { AppRegistry } from 'react-native';
import App from './App';
import './index.css';

// ثبت برنامه برای محیط وب
AppRegistry.registerComponent('Main', () => App);

// اجرای برنامه در المنت root
AppRegistry.runApplication('Main', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
