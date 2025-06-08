const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotificationOnComment = functions.firestore
  .document("posts/{postId}/comments/{commentId}")
  .onCreate(async (snap, context) => {
    const comment = snap.data();
    const postId = context.params.postId;

    // Obtener los datos del post para saber quién lo publicó
    const postDoc = await admin.firestore().collection("posts").doc(postId).get();
    const post = postDoc.data();

    if (!post || !post.userId) return null;

    // Obtener el token del usuario dueño del post
    const userDoc = await admin.firestore().collection("users").doc(post.userId).get();
    const user = userDoc.data();

    if (!user || !user.expoToken) return null;

    const message = {
      to: user.expoToken,
      sound: 'default',
      title: 'Nuevo comentario',
      body: `${comment.authorName} comentó tu publicación.`,
      data: { postId },
    };

    // Enviar notificación usando la API de Expo
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    return null;
  });
