import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { 
  collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, updateDoc, deleteDoc 
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Configuración de Firebase

const HelpScreen = () => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((userSnap) => {
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        }
      });
    }

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Obtener comentarios de una publicación
  const fetchComments = (postId) => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      }));
    });
  };

  // Manejo de expansión de comentarios
  const toggleComments = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      fetchComments(postId);
    }
  };

  // Publicar un nuevo post
  const handlePost = async () => {
    if (postText.trim()) {
      await addDoc(collection(db, "posts"), {
        text: postText,
        user: userName,
        userId: auth.currentUser?.uid,
        timestamp: new Date(),
      });
      setPostText("");
    }
  };

  // Iniciar edición de una publicación
  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditedText(post.text);
  };

  // Guardar edición de una publicación
  const saveEdit = async (postId) => {
    if (editedText.trim()) {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { text: editedText });
    }
    setEditingPostId(null);
    setEditedText("");
  };

  // Eliminar una publicación
  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  // Publicar un comentario
  const handleComment = async (postId) => {
    if (commentText.trim()) {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: commentText,
        user: userName,
        userId: auth.currentUser?.uid,
        timestamp: new Date(),
      });
      setCommentText("");
    }
  };

  // Eliminar un comentario
  const deleteComment = async (postId, commentId) => {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "bold" }}>{item.user || "Usuario desconocido"}</Text>

            {/* Modo Edición */}
            {editingPostId === item.id ? (
              <>
                <TextInput
                  value={editedText}
                  onChangeText={setEditedText}
                  style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
                />
                <Button title="Guardar" onPress={() => saveEdit(item.id)} />
              </>
            ) : (
              <>
                <Text>{item.text}</Text>
                {item.timestamp?.seconds ? (
                  <Text style={{ fontSize: 10, color: "gray" }}>
                    {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                  </Text>
                ) : null}
              </>
            )}

            {/* Mostrar botones de edición y eliminación solo si el usuario es el autor */}
            {item.userId === auth.currentUser?.uid && (
              <>
                {editingPostId !== item.id && (
                  <TouchableOpacity onPress={() => startEditing(item)}>
                    <Text style={{ color: "blue", marginTop: 5 }}>Editar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deletePost(item.id)}>
                  <Text style={{ color: "red", marginTop: 5 }}>Eliminar</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Botón para ver comentarios */}
            <TouchableOpacity onPress={() => toggleComments(item.id)}>
              <Text style={{ color: "green", marginTop: 5 }}>
                {expandedPostId === item.id ? "Ocultar comentarios" : "Ver comentarios"}
              </Text>
            </TouchableOpacity>

            {/* Sección de comentarios */}
            {expandedPostId === item.id && (
              <View style={{ marginTop: 10, paddingLeft: 10 }}>
                <FlatList
                  data={comments[item.id] || []}
                  keyExtractor={(comment) => comment.id}
                  renderItem={({ item }) => (
                    <View style={{ paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                      <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
                      <Text>{item.text}</Text>
                      {item.timestamp?.seconds ? (
                        <Text style={{ fontSize: 10, color: "gray" }}>
                          {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                        </Text>
                      ) : null}

                      {/* Botón para eliminar comentario si es el autor */}
                      {item.userId === auth.currentUser?.uid && (
                        <TouchableOpacity onPress={() => deleteComment(expandedPostId, item.id)}>
                          <Text style={{ color: "red", marginTop: 5 }}>Eliminar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                />

                {/* Input para agregar un comentario */}
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Escribe un comentario"
                  style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
                />
                <Button title="Comentar" onPress={() => handleComment(item.id)} />
              </View>
            )}
          </View>
        )}
      />

      {/* Input para crear publicaciones */}
      <TextInput
        value={postText}
        onChangeText={setPostText}
        placeholder="Escribe tu publicación"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Publicar" onPress={handlePost} />
    </View>
  );
};

export default HelpScreen;
