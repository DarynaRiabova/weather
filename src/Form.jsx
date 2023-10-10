import "./App.css";
export default function Form() {
  return (
    <form class="search-city" id="search-form">
      <input
        type="search"
        id="search"
        class="search"
        placeholder=" Enter your city"
      />
      <input
        type="submit"
        value="Search"
        class="form-control btn btn-primary shadow-sm"
        id="search-button"
      />
      <input
        type="submit"
        value="Current"
        class="form-control btn btn-primary shadow-sm"
        id="current-button"
      />
    </form>
  );
}
