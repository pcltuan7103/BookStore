import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import styles from '@/assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

export default function Create() {
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [rating, setRating] = useState(0);
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { token } = useAuthStore();

    const pickImage = async () => {
        try {
            //Request permission
            if (Platform.OS === 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
                    return;
                }
            }

            //Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.3,
                base64: true,
            })

            if (!result.canceled) {
                setImage(result.assets[0].uri);

                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64);
                } else {
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    })

                    setImageBase64(base64);
                }
            }
        } catch (error) {
            console.error("Error picking image", error);
            Alert.alert("Error", "There was a problem selecting your image");
        }
    }

    const handleSubmit = async () => {
        if (!title || !caption || !image || !rating) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            setLoading(true);

            const uriParts = image.split(".");
            const fileType = uriParts[uriParts.length - 1];
            const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

            const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

            const response = await fetch(`${API_URL}/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    caption,
                    rating: rating.toString(),
                    image: imageDataUrl,
                }),
            });

            console.log(response)

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong");

            Alert.alert("Success", "Your book recommendation has been posted!");
            setTitle("");
            setCaption("");
            setRating(0);
            setImage(null);
            setImageBase64(null);

            router.push("/tabs");
        } catch (error: any) {
            console.error("Error creating book", error);
            Alert.alert("Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const renderRatingPicker = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            )
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.scrollViewStyle}
            >
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Book Recommendation</Text>
                        <Text style={styles.subtitle}>Share your favorite reads with orthers</Text>
                    </View>
                    {/* Form */}
                    <View style={styles.form}>
                        {/* Title */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Title</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter book title"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        {/* Rating */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Your Rating</Text>
                            {renderRatingPicker()}
                        </View>

                        {/* Image */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Image</Text>
                            <TouchableOpacity
                                style={styles.imagePicker}
                                onPress={pickImage}
                            >
                                {
                                    image ? (
                                        <Image source={{ uri: image }} style={styles.previewImage} />
                                    ) : (
                                        <View style={styles.placeholderContainer}>
                                            <Ionicons
                                                name='image-outline'
                                                size={40}
                                                color={COLORS.textSecondary}
                                            />
                                            <Text style={styles.placeholderText}>Tap to select image</Text>
                                        </View>
                                    )
                                }
                            </TouchableOpacity>
                        </View>

                        {/* Caption */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Caption</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Write tour review or throughts about this book ..."
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                            />
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons
                                        name='cloud-upload-outline'
                                        size={20}
                                        color={COLORS.white}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Share</Text>
                                </>
                            )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}