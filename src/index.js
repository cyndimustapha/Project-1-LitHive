/*document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".navbar form");
  const searchInput = document.querySelector('.navbar input[type="search"]');
  const popularBooksContainer = document.getElementById("popularBooks");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      searchBooks(searchTerm);
    }
  });

  function searchBooks(searchTerm) {
    // Clear previous search results
    popularBooksContainer.innerHTML = "";

    // Fetch book data from Open Library API
    fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          data.docs.forEach((book) => {
            const title = book.title ? book.title : "No title available";
            const author = book.author_name ? book.author_name.join(", ") : "Unknown author";
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            const description = book.description ? book.description : "No description available";

            const bookItem = `
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <img src="${coverUrl}" class="card-img-top" alt="${title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${title}</h5>
                                        <p class="card-text"><strong>Author:</strong> ${author}</p>
                                        <p class="card-text">${description}</p>
                                    </div>
                                </div>
                            </div>
                        `;
            popularBooksContainer.innerHTML += bookItem;
            
          });
        } else {
          popularBooksContainer.innerHTML = "<p>No books found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        popularBooksContainer.innerHTML = "<p>An error occurred. Please try again later.</p>";
      });
  }
});
*/

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".navbar form");
  const searchInput = document.querySelector('.navbar input[type="search"]');
  const popularBooksContainer = document.getElementById("popularBooks");
  const bookDetailsContainer = document.getElementById("bookDetails");

  // Function to display book details
  function displayBookDetails(book) {
    const { title, author, coverUrl, description } = book;
    const detailsHTML = `
      <div class="card">
        <img src="${coverUrl}" class="card-img-top" alt="${title}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text"><strong>Author:</strong> ${author}</p>
          <p class="card-text">${description}</p>
        </div>
      </div>
    `;
    bookDetailsContainer.innerHTML = detailsHTML;
  }

  // Function to fetch books based on search term
  function searchBooks(searchTerm) {
    // Clear previous search results
    popularBooksContainer.innerHTML = "";

    // Fetch book data from Open Library API
    fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          data.docs.forEach((book) => {
            const title = book.title ? book.title : "No title available";
            const author = book.author_name ? book.author_name.join(", ") : "Unknown author";
            const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            const description = book.description ? book.description : "No description available";

            const bookItem = `
              <div class="col-md-4 mb-4 book-item">
                <div class="card">
                  <img src="${coverUrl}" class="card-img-top" alt="${title}">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text"><strong>Author:</strong> ${author}</p>
                    <p class="card-text">${description}</p>
                  </div>
                </div>
              </div>
            `;
            popularBooksContainer.innerHTML += bookItem;

            // Add click event listener to each book item
            const bookItems = document.querySelectorAll(".book-item");
            bookItems.forEach((item) => {
              item.addEventListener("click", function () {
                displayBookDetails({
                  title,
                  author,
                  coverUrl,
                  description,
                });
              });
            });
          });
        } else {
          popularBooksContainer.innerHTML = "<p>No books found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        popularBooksContainer.innerHTML =
          "<p>An error occurred. Please try again later.</p>";
      });
  }

  // Event listener for search form submission
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      searchBooks(searchTerm);
    }
  });
});

