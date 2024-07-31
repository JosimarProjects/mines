import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import params from './src/params';
import { Component } from 'react';
import { createMinedBoard, cloneBoard, openField, hadExplosion, wonGame, showMines, invertFlag, flagsUsed } from './src/functions';
import MineField from './src/components/MineField';
import Header from './src/components/Header';

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()    
    console.warn(cols, rows, params.difficultLevel)
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false
    }  
  }
  
  openField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)
    if (lost) {
      showMines(board)
      Alert.alert('Perdeeeeu!', 'Que burro!')
    }
    if (won) {
      Alert.alert('Parabéns', 'Você venceu!')
    }
    this.setState({ board, won, lost })
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if (won) {
      Alert.alert('Parabéns', 'Você venceu!')
    }

    this.setState({ board, won })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header 
          flagsLeft={this.minesAmount() - flagsUsed(this.state.board)}
          onNewGame={() => this.setState(this.createState())}
        />
        <View style={styles.board}>
          <MineField 
            board={this.state.board}
            onOpenField={this.openField}
            onSelectField={this.onSelectField}
          />          
        </View>       
      </View>
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  board: {
    alignItems: 'center',
    backgroundColor: '#AAA'
  }
});
