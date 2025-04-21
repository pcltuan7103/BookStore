import { View, Text, Alert, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/api';
import { useAuthStore } from '@/store/authStore';
import styles from '@/assets/styles/profile.styles';
import { Loader, LogoutButton, ProfileHeader } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { Image } from 'expo-image';
import { sleep } from '.';

export default function Profile() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletedBookId, setDeletedBookId] = useState<string | null>(null);

    const router = useRouter();

    const { token } = useAuthStore();

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/books/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            setBooks(data);
        } catch (error) {
            console.error("Error fetching data", error);
            Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleDeleteBook = async (bookId: string) => {
        try {
            setDeletedBookId(bookId)
            const response = await fetch(`${API_URL}/books/${bookId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            setBooks(books.filter((book) => book._id !== bookId));
            Alert.alert("Success", "Recommendation deleted successfully.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete recommendation. Please try again.");
        } finally {
            setDeletedBookId(null);
        }
    }

    const confirmDeteleBook = (bookId: string) => {
        Alert.alert(
            "Delete Book",
            "Are you sure you want to delete this book?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => handleDeleteBook(bookId),
                },
            ],
            { cancelable: true }
        );
    };

    const renderBookItem = ({ item }: { item: Book }) => (
        <View style={styles.bookItem}>
            <Image source={item.image} style={styles.bookImage} />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
                <Text style={styles.bookCaption} numberOfLines={2}>
                    {item.caption}
                </Text>
                <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeteleBook(item._id)}>
                {deletedBookId === item._id ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <Ionicons name='trash-outline' size={20} color={COLORS.textSecondary} />
                )}
            </TouchableOpacity>
        </View>
    )

    const renderRatingStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={14}
                    color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return stars;
    };

    const handleRefresh = async () => {
        await sleep(800);
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }

    if (loading && !refreshing) return <Loader />

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogoutButton />

            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your recommendations</Text>
                <Text style={styles.booksCount}>{books.length} books</Text>
            </View>

            <FlatList
                data={books}
                renderItem={renderBookItem}
                keyExtractor={book => book._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.booksList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name='book-outline' size={50} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendations yet</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/tabs/create')}>
                            <Text style={styles.addButtonText}>Add your first book</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    )
}