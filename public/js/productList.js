/* EventListener for 'cart' button: */
document.querySelectorAll(".cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId =
      btn.parentNode.parentNode.parentNode.getAttribute("product_id");

    console.log(productId);
  });
});

/* EventListener for 'detail' button: */
document.querySelectorAll(".detail-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId =
      btn.parentNode.parentNode.parentNode.getAttribute("product_id");

    console.log(productId);
  });
});
