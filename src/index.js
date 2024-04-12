// Function to toggle dark mode
function toggleDarkMode() {
  document.body.classList.remove("bg-light");
  document.body.classList.add("bg-dark");
}

// Function to toggle light mode
function toggleLightMode() {
  document.body.classList.remove("bg-dark");
  document.body.classList.add("bg-light");
}

// Event listener for the dropdown items
document.getElementById("darkMode").addEventListener("click", toggleDarkMode);
document.getElementById("lightMode").addEventListener("click", toggleLightMode);

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".navbar form");
  const searchInput = document.querySelector('.navbar input[type="search"]');
  const popularBooksContainer = document.getElementById("popularBooks");
  const bookDetailsModal = new bootstrap.Modal(document.getElementById("bookDetailsModal"));

  // Define an array of books to fetch from the Open Library API
  const booksToFetch = [
    { title: "The Hunger Games", author: "Suzanne Collins" },
    { title: "The Book Thief", author: "Markus Zusak" },
    { title: "The House of Hades", author: "Rick Riordan" },
    { title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling" },
    { title: "The Maze Runner", author: "James Dashner" },
    { title: "Me Before You", author: "Jojo Moyes"}
  ];

  // Function to fetch book details from the Open Library API
  async function fetchBookDetails(book) {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`);
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const firstResult = data.docs[0];
        return {
          title: firstResult.title,
          author: firstResult.author_name ? firstResult.author_name.join(", ") : "Unknown author",
          coverUrl: `https://covers.openlibrary.org/b/id/${firstResult.cover_i}-M.jpg`,
          description: firstResult.description ? firstResult.description.value : "No description available"
        };
      } else {
        return null; // Book not found
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  }

  // Function to render books onto the page
  async function renderBooks() {
    for (const book of booksToFetch) {
      const bookDetails = await fetchBookDetails(book);
      if (bookDetails) {
        const bookItem = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${bookDetails.coverUrl}" class="card-img-top" alt="${bookDetails.title}">
              <div class="card-body">
                <h5 class="card-title">${bookDetails.title}</h5>
                <p class="card-text"><strong>Author:</strong> ${bookDetails.author}</p>
                <p class="card-text">${bookDetails.description}</p>
                <button class="btn btn-primary view-details" data-title="${bookDetails.title}" data-author="${bookDetails.author}" data-cover="${bookDetails.coverUrl}" data-description="${bookDetails.description}">View Details</button>
              </div>
            </div>
          </div>
        `;
        popularBooksContainer.innerHTML += bookItem;
      } else {
        // Handle case where book details are not found
        console.log(`Book '${book.title}' by ${book.author} not found.`);
      }
    }
  }

  // Call the rendering function to fetch and display book details on page load
  renderBooks();

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
            const coverUrl = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : "https://via.placeholder.com/150";
            const description = book.description
              ? book.description.value
              : "No description available";

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
                description,
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

    const close = document.querySelector(".modal .close");

    close.addEventListener("click", function () {
      const modal = document.getElementById("bookDetailsModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    });
  }

  const closeButton = document.querySelector(".modal-footer .btn btn-secondary");

  closeButton.addEventListener("click", () => {
    bookDetailsModal.hide();
  });
});

