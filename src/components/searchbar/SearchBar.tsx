import './SearchBar.css';
import type { ChangeEvent, FormEvent } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;    
  placeholder?: string;
};

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search Movie ...' }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <span className="icon" aria-hidden="true">🔎</span>
      <input
        className="input"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        inputMode="search"
        aria-label="Search movies"
      />
    </form>
  );
}
