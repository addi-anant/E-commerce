const deleteBtnList = document.querySelectorAll(".delete-btn");
deleteBtnList.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", () => {
    console.log(deleteBtn + " clicked");
  });
});
