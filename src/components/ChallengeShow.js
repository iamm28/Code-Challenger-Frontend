import React from "react";
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {addFavorite} from '../actions/users'
import {ROOT, HEADERS} from '../constants/index'
import {voteUpChallenge, voteDownChallenge } from '../actions/challenges'

class ChallengeShow extends React.Component {

  handleClick = (event) => {
    switch (event.target.id) {
      case 'favorite':
        return this.saveChallenge();
      case 'upvote':
        return this.upvoteChallenge();
      case 'downvote':
        return this.downvoteChallenge();
      default:
        return console.log('sorry!')
    }
  }
  
  saveChallenge = () => {
    fetch(`${ROOT}user_challenges`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        user_id: this.props.user.id,
        challenge_id: this.props.showChallenge.id
      })
    })
    .then(res => res.json())
    .then(json => this.props.addFavorite(json))
  }
    
  upvoteChallenge = () => {
    let rating = parseInt(this.props.showChallenge.rating, 10)
    if (rating < 10 ) {
      let newRating = rating+=1
      fetch(`${ROOT}challenges/${this.props.showChallenge.id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({
          rating: newRating
        })
      })
      .then(res => {
        res.status === 200 ? this.props.voteUpChallenge(this.props.showChallenge.id) : console.log(res)
      })
    }
  }
  
  downvoteChallenge = () => {
    let rating = parseInt(this.props.showChallenge.rating, 10)
    if (rating > 0 ) {
      let newRating = rating-=1
      fetch(`${ROOT}challenges/${this.props.showChallenge.id}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({
          rating: newRating
        })
      })
      .then(res => {
        res.status === 200 ? this.props.voteDownChallenge(this.props.showChallenge.id) : console.log(res)
      })
    }
  }
  
  getFinishedLinks = () => {
    if (this.props.user) {

      let relevantLinks = this.props.lazy_links.filter(link => link.id === this.props.showChallenge.id)
      
      if (relevantLinks.length > 0) {
        return relevantLinks.map(link => (
          <div key={link.id}>
            <Link id="username-link" to={`/users/all/${link.user.id}`}>{link.user.username}<br/></Link>
            <a href={`http://${link.git_link}`} target='_blank'>GitHub</a> | <a href={`http://${link.live_link}`} target='_blank'>Deployed</a>
          </div>
          )
        )
      } else {
        return <p>Be the first to complete this!</p>
      }
    } 
  }
  
  render() {
    if (this.props.showChallenge && this.props.user) {
      return (
        <div className="challenge-show">
          <h1>{this.props.showChallenge.content}</h1>
          
          <div className='links-div'><h4>Helpful Documentation Links:</h4> {this.props.showChallenge.links !== null ? this.props.showChallenge.links.split(', ').map(link => <p key={link}><a href={link} target="_blank">{link}</a></p>) : <p>no links yet</p>}</div>
          
          <div className='show-buttons'>
            {!!this.props.user.favorites.find(fav => fav.challenge.id === this.props.showChallenge.id) ? <Link to={`/users/${this.props.showChallenge.id}/challenges`}>See Your Progress</Link> : <i onClick={this.handleClick} id='favorite' className="material-icons">favorite</i>}
            
            <i onClick={this.handleClick} id='upvote' className="material-icons">arrow_upward</i>
            <i onClick={this.handleClick} id='downvote' className="material-icons">arrow_downward</i>
            <p id='show-rating'>Rating: {this.props.showChallenge.rating}/10</p>
          </div>
          
          <div className="finished-examples">
            <h4>How others have tackled this challenge:</h4>
            {this.getFinishedLinks()}
          </div>
          
        </div>
      )
    } else {
      return (
       <div className="log-in-reminder">
        <h1>Please <Link to='/'>log in</Link>  to view challenges</h1>
      </div>
     )
    }
  }
}

const mapStateToProps = (state) => {
  return {...state.users, ...state.challenges, ...state.showChallenge}
}

export default connect(mapStateToProps, {addFavorite, voteUpChallenge, voteDownChallenge})(ChallengeShow);
