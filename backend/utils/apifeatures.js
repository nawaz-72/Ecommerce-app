class APIfeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const querycopy = { ...this.querystr };

    //Removing some field for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete querycopy[key]);

    //filter for pricing and rating
    let querystr = JSON.stringify(querycopy);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(querystr));

    return this;
  }
  //pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.querystr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = APIfeatures;
