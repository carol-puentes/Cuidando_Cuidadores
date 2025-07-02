const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.notifyOnNewComment = functions.firestore
    .document("posts/{postId}/comments/{commentId}")
    .onCreate(async (snap, context) => {
      const newComment = snap.data();
      const {postId} = context.params;

      try {
        const postRef = admin.firestore().collection("posts").doc(postId);
        const postSnap = await postRef.get();

        if (!postSnap.exists) {
          console.log("El post no existe.");
          return null;
        }

        const post = postSnap.data();

        // Obtener info del usuario dueño del post
        const userRef = admin.firestore().collection("users").doc(post.userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          console.log("El usuario no existe.");
          return null;
        }

        const user = userSnap.data();

        if (!user.expoPushToken) {
          console.log("El usuario no tiene token de notificación.");
          return null;
        }

        const payload = {
          to: user.expoPushToken,
          sound: "default",
          title: "Nueva respuesta",
          body: `${newComment.user} comentó tu publicación`,
        };

        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("Notificación enviada");
        return null;
      } catch (error) {
        console.error("Error enviando notificación:", error);
        return null;
      }
    });
