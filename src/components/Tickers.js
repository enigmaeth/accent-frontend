import React, { Component } from "react";
import "./Tickers.css";
import { Button, Jumbotron, Row, UncontrolledAlert } from "reactstrap";
import { corpus } from "./sentences";
import NumericInput from "react-numeric-input";

class Tickers extends Component {
  constructor(props) {
    super(props);
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.readFromFile = this.readFromFile.bind(this);
    this.stopShow = this.stopShow.bind(this);
    this.startShow = this.startShow.bind(this);
    this.goto = this.goto.bind(this);
    this.state = {
      file_counter: -1,
      line_counter: 0,
      displayTwo: (
        <h3 class="italic-headings-page">
          The sentences will appear here. Click on 'Next Set' to begin.
        </h3>
      ),
      repeat_counter: 3,
      showingAlert: false,
      alert: {type: '', text: ""}
    };
  }

  NodeNull() {}

  getNextTwo() {
    if (this.state.repeat_counter == 1 && this.state.line_counter >= 10) {
      this.state.repeat_counter = 3;
      this.stopShow();
      alert("Set Completed. Please stop recording.");
    } else if (this.state.repeat_counter != 0 && this.state.line_counter > 9) {
      this.state.line_counter = 0;
      this.state.repeat_counter -= 1;
    }
    // this.setState({displayTwo: <small>loading..</small>})
    setTimeout(this.NodeNull, 1000);
    const sentences = this.readFromFile();
    this.setState({
      displayTwo: <h3>{sentences}</h3>
    });
  }

  readFromFile() {
    const sentence = this.state.allSentences[this.state.file_counter][
      this.state.line_counter
    ];
    this.setState({
      line_counter: Math.min(this.state.line_counter + 1, 10)
    });
    return sentence;
  }

  chunkArray(myArray, chunk_size) {
    const results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }

  componentDidMount() {
    this.setState({
      allSentences: this.chunkArray(corpus, 10)
    });
  }

  // update time here: for 5 seconds: write 5 * 1000
  startShow() {
    this.setState({ interval: setInterval(() => this.getNextTwo(),  5 * 1000),
    alert: {type:'success', text: 'Playing Set: ' + (this.state.file_counter + 2)} });
  }

  stopShow() {
    clearInterval(this.state.interval);
    this.setState({ displayTwo: "" });
  }

  onNext() {
    clearInterval(this.state.interval);
    this.setState({
      // file_counter: Math.min(this.state.file_counter + 1, this.state.allSentences.length - 1)
      file_counter: this.state.file_counter + 1,
      line_counter: 0
    });
    this.startShow();
  }

  onPrev() {
    clearInterval(this.state.interval);
    this.setState({
      // file_counter: Math.max(0, this.state.file_counter - 1)
      file_counter: Math.max(0, this.state.file_counter - 1),
      line_counter: 0
    });
    this.startShow();
  }

  goto(valueAsNumber, valueAsString, el) {
    clearInterval(this.state.interval);
    this.setState({
      file_counter: valueAsNumber - 1,
      line_counter: 0,
      displayTwo: <h3>...</h3>
    });
    this.startShow();
  }

  render() {
    return (
      <div>
        <br />
        <UncontrolledAlert color={this.state.alert.type}>{this.state.alert.text}</UncontrolledAlert>
        <h4>Set # {this.state.file_counter + 1}</h4>
        <p>
          <strong>{this.state.line_counter} of 10</strong>
        </p>
        <br />
        <Jumbotron>{this.state.displayTwo}</Jumbotron>
          <Button color="primary" onClick={this.onNext}>
            Next Set
          </Button>{" "}
          <Button color="info" onClick={this.onPrev}>
            Previous Set
          </Button>{" "}
          <Button color="danger" onClick={this.stopShow}>
            Stop
          </Button>{" "}
            &nbsp; &nbsp;
             Goto Set: <NumericInput
              strict
              default={1}
              min={1}
              max={72}
              value={this.state.file_counter + 1}
              onChange={this.goto}
            />{" "}
        <Row>
        </Row>
      </div>
    );
  }
}

export default Tickers;
