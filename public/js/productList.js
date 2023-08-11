// fetch all the todo from the server and display them to the user:
const fetchProduct = async (number) => {
  const response = await fetch(`/fetch-product/${number}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const productList = await response.json();

  productList.forEach((product) => {
    addToDOM(product._id, product.name, product.img, product.price);
  });
};
fetchProduct(5);

// Add product to DOM:
const cardContainer = document.querySelector(".card-container");
const addToDOM = function (id, name, imgURL, price) {
  const product = `<div class="card" product_id=${id}>
    <div class="card-top">
      <img src=${imgURL} />
    </div>
    <div class="card-lower">
      <div class="card-detail">
        <p class="name">${name}</p>
        <p class="cost">
          <i class="fa-solid fa-indian-rupee-sign"></i>
          ${price}
        </p>
      </div>

      <div class="button-container">
        <button type="button" class="cart-btn" onclick = addToCart("${id}")  >Add to cart</button>
        <button type="button" class="detail-btn" onclick = viewDetail("${id}")>Detial</button>
      </div>
    </div>
  </div>`;

  cardContainer.insertAdjacentHTML("beforeend", product);
};

const modalWrapper = document.getElementById("modal");
const body = document.querySelector("body");
const viewDetail = async (id) => {
  const response = await fetch(`/product/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const product = await response.json();

  const modal = `<div class="modal-outer">
    <i class="fa-solid fa-xmark close" onclick="removeModal(this)"></i>
    <div class="left">
      <img src="${product?.img}" alt="" />
    </div>
    <div class="right">
      <p class="heading">${product?.name}</p>
      <p class="cost">
        <i class="fa-solid fa-indian-rupee-sign"></i>
        ${product?.price}
      </p>
      <p class="description">${product?.description}</p>
    </div>
  </div>`;

  // append a modal.
  cardContainer.classList.add("opc");
  modalWrapper.classList.add("modal-wrapper");
  modalWrapper.insertAdjacentHTML("beforeend", modal);
};

const removeModal = (val) => {
  cardContainer.classList.remove("opc");
  modalWrapper.removeChild(val.parentNode);
  modalWrapper.classList.remove("modal-wrapper");
};

const loadProduct = () => {
  let count = 5;
  document.getElementById("load-more-btn").addEventListener("click", () => {
    count += 5;
    fetchProduct(count);
  });
};

loadProduct();

const addToCart = async (id) => {
  console.log(id);
  const response = await fetch(`/user/add-product-cart/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 401) {
    window.location.replace("/auth/login");
  }

  const product = await response.json();
  console.log(product);

  console.log(response.status);
};
