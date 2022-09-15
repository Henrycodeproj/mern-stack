import {useState, useContext} from "react";
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Emojis } from "../../ReusablesComponents/Emojis";
import "./EditOption.css"
import { accountContext } from "../../Contexts/appContext";



export const EditOption = ({post, editOpen, setEditOpen}) => {

    const {posts, setPosts} = useContext(accountContext)

    const [postDescription, setPostDescription] = useState(post.Description)
    const [editAnchor, setEditAnchor] = useState(null)

    const closeEditOption = () => {
        setEditOpen(false);
        setPostDescription(post.Description)
    };

    const getIndex = (id) =>{
      return posts.findIndex(posting => posting._id === id)
    }

    const submitEdit = async () => {
      setEditOpen(false);
      const Url = `http://localhost:3001/posts/edit/${post._id}`
      const data = {updatedDescription:postDescription}
      const updatedPost = await axios.patch(Url, data, {
        headers:{
          "authorization":localStorage.getItem("Token")
        }
      })
      setPosts(post => {
        const oldPost = [...post];
        oldPost[getIndex(updatedPost.data._id)] = updatedPost.data;
        return oldPost
      })
    }
    
  return (
    <>
        <Dialog
        open={editOpen}
        onClose={closeEditOption}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Edit Current Post"}
        </DialogTitle>
        <DialogContent sx={{width: "300px", height: "300px"}}>
            <TextareaAutosize
            aria-label="empty textarea"
            placeholder="Empty"
            style={{ width: 300 }}
            onChange = {e => setPostDescription(e.target.value)}
            value = {postDescription}
            rows = {10}
            className = "edit_textbox"
            >
            {postDescription}
            </TextareaAutosize>
            <Emojis
            input = {postDescription}
            setInput = {setPostDescription}
            anchor = {editAnchor}
            setAnchor = {setEditAnchor}
            title = {false}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={()=> submitEdit()} variant="contained" size="medium" color="secondary">
              Submit
            </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
