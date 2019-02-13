const postContainer = document.querySelector("#post-container");
const form = document.querySelector("#posts-search");

const renderPosts = ({ data }) => {
  // firstChild returns first tag inside the postContainer
  while (postContainer.firstChild) {
    // in other words, empty the postContainer
    postContainer.removeChild(postContainer.firstChild);
  }
  const { posts = [] } = data;
  const list = document.createElement("ul");
  posts.forEach(post => {
    console.log(post);
    const postEl = document.createElement("li");
    const subject = document.createElement("h2");
    const content = document.createElement("p");
    subject.textContent = post.subject;
    content.textContent = post.content;
    postEl.appendChild(subject);
    postEl.appendChild(content);
    list.appendChild(postEl);
  });
  postContainer.appendChild(list);
};

const getPostsQuery = keyword => `
  query getPosts {
    posts(where: {subject: { _ilike: "%${keyword}%" }}) {
      subject
      content
    }
  }
`;

const loadPosts = ev => {
  ev.preventDefault();
  const keyword = form.elements["search"].value;

  // options for the fetch method
  const options = {
    // alwais post with GraphQl
    method: "post",
    // the security key for Hasura
    headers: {
      "Content-Type": "application/json",
      "X-Hasura-Access-Key": "notasecret"
    },
    body: JSON.stringify({
      query: getPostsQuery(keyword)
    })
  };

  // fetch calls an http method with a promes
  fetch(
    `https://graphql-bootcamp-sample-blog.herokuapp.com/v1alpha1/graphql`,
    options
  )
    .then(res => res.json())
    .then(renderPosts)
    .catch(e => console.log(e));
};

form.addEventListener("submit", loadPosts);
