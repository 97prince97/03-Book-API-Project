
booky.delete("/author/delete/:id", async (req, res) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  return res.json({ authors: updatedAuthorDatabase });
});