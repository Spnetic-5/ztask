import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X } from 'lucide-react';
import { dummyData } from "./data";
import "./App.css";

// Define interface for User
interface User {
  profile_picture: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface CardProps {
  user?: User;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ user, onClick }) => {
  return (
    <div className="list" onClick={onClick}>
      <div className="user">
        <div className="avatar">
          {user && user.profile_picture && (
            <img src={user.profile_picture} alt="Profile" />
          )}
        </div>
        <div className="content">
          <span className="name">
            {user && `${user.first_name} ${user.last_name} `}
          </span>
          <span className="email">{user && `${user.email}`}</span>
        </div>
      </div>
    </div>
  );
};

interface Chip {
  id: number;
  label: string;
  profile_picture: string;
  email: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [originalData, setOriginalData] = useState<User[]>(dummyData);
  const [filteredItems, setFilteredItems] = useState<User[]>(originalData); // Initialize with original data
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updatedFilteredItems = originalData.filter(
      (item) =>
        item.first_name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !chips.some(
          (chip) => chip.label.toLowerCase() === item.first_name.toLowerCase()
        )
    );
    setFilteredItems(updatedFilteredItems);
  }, [inputValue, chips, originalData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsInputFocused(true);
    }
  };

  const handleItemClick = (item: User) => {
    const updatedChips = [
      ...chips,
      {
        id: Date.now(),
        label: `${item.first_name} ${item.last_name}`,
        email: item.email,
        profile_picture: item.profile_picture,
      },
    ];
    setChips(updatedChips);
    setOriginalData((prevData) =>
      prevData.filter((data) => data.email !== item.email)
    );
    setInputValue("");
    setIsInputFocused(false);
  };

  const handleChipRemove = (chipId: number, email: string) => {
    const updatedChips = chips.filter((chip) => chip.id !== chipId);
    setChips(updatedChips);
    const removedUser = dummyData.find((item) => item.email === email);
    if (removedUser) {
      setOriginalData((prevData) => [...prevData, removedUser]);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue === "") {
      const lastChip = chips[chips.length - 1];
      if (lastChip) {
        handleChipRemove(lastChip.id, lastChip.email);
      }
    }
  };

  return (
    <div className="main">
      <div className="chip-input-container">
        {chips.map((chip) => (
          <div key={chip.id} className="chip">
            <div className="avatar">
              {chip && chip.profile_picture && (
                <img src={chip.profile_picture} alt="Profile" />
              )}
            </div>
            <div className="content">
              <span className="name">{chip.label}</span>
            </div>
            <span
              className="chip-remove"
              onClick={() => handleChipRemove(chip.id, chip.email)}
            >
              <X size={12} strokeWidth={4}/>
            </span>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          placeholder="Type here..."
        />
      </div>
      {isInputFocused && (
        <div className="item-list">
          {filteredItems.map((item) => (
            <Card
              key={item.email}
              user={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
