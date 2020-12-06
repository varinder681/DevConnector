import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import Spinner from "../layout/Spinner";
import PropTypes from "prop-types";
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({ post: { posts, loading }, getPosts }) => {
  useEffect(() => {
    getPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPosts]);
  return loading ? <Spinner /> : <Fragment>
    <h1 className='text-primary'>Posts</h1>
    <p className='lead'>
        <i className="fas fa-user"></i> Welcome to the community
    </p>

    <PostForm />
    
    <div className='posts'>
        {posts.map(post => (
            <PostItem key={post._id} post={post} />
        ))}
    </div>
  </Fragment>;
};

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  post: state.post,
});
export default connect(mapStateToProps, { getPosts })(Posts);
