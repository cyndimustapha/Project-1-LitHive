/*document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".navbar form");
  const searchInput = document.querySelector('.navbar input[type="search"]');
  const popularBooksContainer = document.getElementById("popularBooks");

  async function displayRandomBooks() {
    try {
      const apiUrl = `https://openlibrary.org/works/random.json`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      const title = data.title ? data.title : "No title available";
      const author = data.authors
        ? data.authors.map((author) => author.name).join(", ")
        : "Unknown author";
      const coverUrl = data.cover_i
        ? `https://covers.openlibrary.org/b/id/${data.cover_i}-M.jpg`
        : "https://via.placeholder.com/150";
      const description = data.description ? data.description.value : "No description available";

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
    } catch (error) {
      console.error("Error loading homepage", error);
    }
  }

  displayRandomBooks(); // Call the function to display random books on page load

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
  const bookDetailsModal = new bootstrap.Modal(document.getElementById('bookDetailsModal'));

  async function displayRandomBooks() {
      try {
          const apiUrl = `https://openlibrary.org/works/random.json`;
          const response = await fetch(apiUrl);
          const data = await response.json();

          const title = data.title ? data.title : "No title available";
          const author = data.authors ? data.authors.map(author => author.name).join(", ") : "Unknown author";
          const coverUrl = data.cover_i ? `https://covers.openlibrary.org/b/id/${data.cover_i}-M.jpg` : "https://via.placeholder.com/150";
          const description = data.description ? data.description.value : "No description available";

          const bookItem = `
              <div class="col-md-4 mb-4">
                  <div class="card">
                      <img src="${coverUrl}" class="card-img-top" alt="${title}">
                      <div class="card-body">
                          <h5 class="card-title">${title}</h5>
                          <p class="card-text"><strong>Author:</strong> ${author}</p>
                          <p class="card-text">${description}</p>
                          <button class="btn btn-primary view-details" data-title="${title}" data-author="${author}" data-cover="${coverUrl}" data-description="${description}">View Details</button>
                      </div>
                  </div>
              </div>
          `;
          popularBooksContainer.innerHTML += bookItem;
      } catch (error) {
          console.error("Error", error);
      }
  }

  // Call the function to display random books on page load
  displayRandomBooks();

  // Event listener for search form submission
  searchForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission
      const searchTerm = searchInput.value.trim();
      if (searchTerm !== "") {
          searchBooks(searchTerm);
      }
  });

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
                      const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/150";
                      const description = book.description ? book.description.value : "No description available";

                      const bookItem = `
                          <div class="col-md-4 mb-4">
                              <div class="card">
                                  <img src="${coverUrl}" class="card-img-top" alt="${title}">
                                  <div class="card-body">
                                      <h5 class="card-title">${title}</h5>
                                      <p class="card-text"><strong>Author:</strong> ${author}</p>
                                      <p class="card-text">${description}</p>
                                      <button class="btn btn-primary view-details" data-title="${title}" data-author="${author}" data-cover="${coverUrl}" data-description="${description}">View Details</button>
                                  </div>
                              </div>
                          </div>
                      `;
                      popularBooksContainer.innerHTML += bookItem;
                  });

                  // Add click event listener to view details button
                  const viewDetailsButtons = document.querySelectorAll(".view-details");
                  viewDetailsButtons.forEach((button) => {
                      button.addEventListener("click", function () {
                          const title = this.getAttribute("data-title");
                          const author = this.getAttribute("data-author");
                          const coverUrl = this.getAttribute("data-cover");
                          const description = this.getAttribute("data-description");

                          displayBookDetails({
                              title,
                              author,
                              coverUrl,
                              description
                          });
                      });
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

  // Function to display book details in modal
  function displayBookDetails(book) {
      const { title, author, coverUrl, description } = book;
      const modalBody = document.getElementById("bookDetailsBody");
      modalBody.innerHTML = `
          <div class="card">
              <img src="${coverUrl}" class="card-img-top" alt="${title}">
              <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text"><strong>Author:</strong> ${author}</p>
                  <p class="card-text">${description}</p>
              </div>
          </div>
      `;
      bookDetailsModal.show();

  }

  document.querySelector('.modal .close').addEventListener('click', function() {
    const modal = document.getElementById('bookDetailsModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
});
});

