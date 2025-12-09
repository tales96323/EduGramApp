import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostCard = ({ post, onToggleSimplify }) => {
  const displayContent = post.isSimplifying ? post.simplifiedSnippet : post.fullContent;

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: post.profilePic }}
          style={styles.profilePic}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.timeText}>{post.time}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Post Title */}
      <Text style={styles.title}>{post.title}</Text>

      {/* Post Image */}
      <Image
        source={{ uri: post.image }}
        style={styles.postImage}
        resizeMode="cover"
      />

      {/* Post Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.content} numberOfLines={post.isSimplifying ? 3 : undefined}>
          {displayContent}
        </Text>
        
        {/* Simplify Button */}
        <TouchableOpacity
          style={styles.simplifyButton}
          onPress={() => onToggleSimplify(post.id)}
        >
          <Ionicons
            name="sparkles"
            size={16}
            color="#4f46e5"
            style={styles.simplifyIcon}
          />
          <Text style={styles.simplifyText}>
            {post.isSimplifying ? 'Ver mais' : 'Simplificar'}
          </Text>
          <Ionicons
            name={post.isSimplifying ? "chevron-down" : "chevron-up"}
            size={16}
            color="#4f46e5"
          />
        </TouchableOpacity>
      </View>

      {/* Post Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color="#6b7280" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  content: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  simplifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    marginBottom: 16,
  },
  simplifyIcon: {
    marginRight: 4,
  },
  simplifyText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
    marginRight: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
});

export default PostCard;

