import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

import { BlurView } from "expo-blur";

import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons, Feather } from "@expo/vector-icons";

const CATEGORIES = ["experiencia", "consejos", "ayuda"];

const HelpScreen = () => {
  const [category, setCategory] = useState(null);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [userName, setUserName] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef).then((userSnap) => {
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(data?.tutor?.name || "Usuario desconocido");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!category) return;

    setLoadingPosts(true);
    setPosts([]);
    setComments({});
    setExpandedPostId(null);

    const q = query(
      collection(db, "posts"),
      where("category", "==", category),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoadingPosts(false);
      },
      (error) => {
        console.error("Error loading posts:", error);
        setLoadingPosts(false);
      }
    );

    return () => unsubscribe();
  }, [category]);

  const fetchComments = (postId) => {
    setLoadingComments(true);
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "desc")
    );
    return onSnapshot(
      q,
      (snapshot) => {
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
        setLoadingComments(false);
      },
      (error) => {
        console.error("Error loading comments:", error);
        setLoadingComments(false);
      }
    );
  };

  const toggleComments = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      setCommentText("");
    } else {
      setExpandedPostId(postId);
      setCommentText("");
      fetchComments(postId);
    }
  };

  const handlePost = async () => {
    if (postText.trim()) {
      await addDoc(collection(db, "posts"), {
        text: postText,
        user: userName,
        userId: auth.currentUser?.uid,
        category,
        timestamp: new Date(),
      });
      setPostText("");
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditedText(post.text);
  };

  const saveEdit = async (postId) => {
    if (editedText.trim()) {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { text: editedText });
    }
    setEditingPostId(null);
    setEditedText("");
  };

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };

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

  const deleteComment = async (postId, commentId) => {
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  };

  if (!category) {
    return (
      <ImageBackground
        source={require("../assets/fondo.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <BlurView intensity={50} tint="light" style={styles.container}>
          <View style={styles.content}>
            <Text style={{ fontSize: 18, marginBottom: 20, textAlign: "center" }}>
              ¿Qué deseas compartir o consultar?
            </Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.button}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.buttonText}>{cat.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </ImageBackground>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F8F9FA" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 40,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}>
          {category.toUpperCase()}
        </Text>

        <TouchableOpacity onPress={() => setCategory(null)}>
          <Icon name="arrow-back" size={24} color="#8080ff" />
        </TouchableOpacity>
      </View>

      {loadingPosts ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#6CAACD" />
          <Text style={{ marginTop: 10, color: "#6CAACD" }}>Cargando posts...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 15,
                borderRadius: 10,
                marginBottom: 15,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#212121" }}>
                {item.user || "Usuario desconocido"}
              </Text>

              {editingPostId === item.id ? (
                <>
                  <TextInput
                    value={editedText}
                    onChangeText={setEditedText}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      padding: 8,
                      borderRadius: 8,
                      marginVertical: 10,
                    }}
                  />
                  <Button title="Guardar" onPress={() => saveEdit(item.id)} />
                </>
              ) : (
                <>
                  <Text style={{ marginTop: 4, fontSize: 15 }}>{item.text}</Text>
                  {item.timestamp?.seconds && (
                    <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
                      {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                    </Text>
                  )}
                </>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity onPress={() => toggleComments(item.id)}>
                  <Text style={{ color: "#8080FF", fontWeight: "500" }}>
                    {expandedPostId === item.id ? "Ocultar comentarios" : "Ver comentarios"}
                  </Text>
                </TouchableOpacity>

                {item.userId === auth.currentUser?.uid && (
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    {editingPostId !== item.id && (
                      <TouchableOpacity onPress={() => startEditing(item)}>
                        <Feather name="edit-2" size={20} color="#007BFF" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => deletePost(item.id)}>
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {expandedPostId === item.id && (
                <View style={{ marginTop: 10 }}>
                  {loadingComments ? (
                    <View style={{ paddingVertical: 20, alignItems: "center" }}>
                      <ActivityIndicator size="small" color="#8080FF" />
                      <Text style={{ marginTop: 5, color: "#8080FF" }}>
                        Cargando comentarios...
                      </Text>
                    </View>
                  ) : (
                    <>
                      <FlatList
                        data={comments[item.id] || []}
                        keyExtractor={(comment) => comment.id}
                        renderItem={({ item: comment }) => (
                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderBottomColor: "#E0E0E0",
                              paddingVertical: 6,
                            }}
                          >
                            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                              {comment.user}
                            </Text>
                            <Text>{comment.text}</Text>
                            {comment.timestamp?.seconds && (
                              <Text style={{ fontSize: 10, color: "gray" }}>
                                {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                              </Text>
                            )}
                            {comment.userId === auth.currentUser?.uid && (
                              <TouchableOpacity
                                onPress={() => deleteComment(expandedPostId, comment.id)}
                              >
                                <Text style={{ color: "red", marginTop: 5 }}>Eliminar</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      />
                      <TextInput
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder="Escribe un comentario"
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 8,
                          padding: 8,
                          marginTop: 10,
                        }}
                      />
                      <Button title="Comentar" onPress={() => handleComment(item.id)} />
                    </>
                  )}
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* <TextInput
        value={postText}
        onChangeText={setPostText}
        placeholder={`Comparte en ${category.toLowerCase()}`}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 10,
          backgroundColor: "#fff",
          marginTop: 20,
        }}
      />
      <TouchableOpacity
        onPress={handlePost}
        style={{
          backgroundColor: "#8080FF",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Publicar
        </Text>
      </TouchableOpacity> */}

      {expandedPostId === null && (
  <>
    <TextInput
      value={postText}
      onChangeText={setPostText}
      placeholder={`Comparte en ${category.toLowerCase()}`}
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginTop: 20,
      }}
    />
    <TouchableOpacity
      onPress={handlePost}
      style={{
        backgroundColor: "#8080FF",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        Publicar
      </Text>
    </TouchableOpacity>
  </>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: "#8080ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default HelpScreen;
