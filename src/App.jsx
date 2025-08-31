import { useState } from 'react'

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
]
{
  /* Reuseable Button */
}
function Button({ children, showOnclick }) {
  return (
    <button className="button" onClick={showOnclick}>
      {children}
    </button>
  )
}

function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function OnAddFriend(newFriend) {
    setFriends(prevFriends => [...prevFriends, newFriend])
  }

  function handleSelectFriend(Onfriend) {
    // setSelectedFriend(Onfriend)
    setSelectedFriend(prev => (prev?.id === Onfriend.id ? null : Onfriend))
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend,
      ),
    )

    setSelectedFriend(null)
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          OnSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend OnAddFriend={OnAddFriend} />}
        <Button showOnclick={() => setShowAddFriend(prev => !prev)}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill selectedFriend={selectedFriend} OnSplitBill={handleSplitBill} />
      )}
    </div>
  )
}

function FriendList({ friends, OnSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          key={friend.id}
          friend={friend}
          OnSelectFriend={OnSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  )
}

function Friend({ friend, OnSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          Your {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button showOnclick={() => OnSelectFriend(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}

function FormAddFriend({ OnAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleName(event) {
    setName(event.target.value)
  }

  function handleImage(event) {
    setImage(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    // Add friend logic here
    if (!name || !image) return

    const newFriend = {
      id: crypto.randomUUID(),
      name,
      image,
      balance: 0,
    }
    OnAddFriend(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑🏼‍🤝‍🧑🏻Friend name</label>
      <input type="text" value={name} onChange={handleName} />

      <label>🌆 Image URL</label>
      <input type="text" value={image} onChange={handleImage} />
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, OnSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function handlePaidByUser(e) {
    setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!bill || !paidByUser) return
    OnSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={e => setBill(Number(e.target.value))} />
      <label>🧍‍♂️ Your expense</label>
      <input type="text" value={paidByUser} onChange={handlePaidByUser} />
      <label>🧑🏼‍🤝‍🧑🏻 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🧑🏼‍🤝 Who is paying the bill</label>
      <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  )
}
export default App
