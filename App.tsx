import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { generateRandomContacts, Contact, sortContacts, filterContacts, groupContactsByFirstLetter } from './src/utils/contacts';

const App = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'firstName' | 'lastName'>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const sectionRefs = useRef<Record<string, View | null>>({});

  useEffect(() => {
    const generated = generateRandomContacts(50);
    setContacts(generated);
  }, []);

  // ძიება და სორტირება
  const getFilteredAndSortedContacts = () => {
    let result = sortContacts(contacts, sortField);
    if (sortDirection === 'desc') result = result.reverse();
    if (search) result = filterContacts(result, search);
    return result;
  };

  const filteredContacts = getFilteredAndSortedContacts();
  const groupedContacts = groupContactsByFirstLetter(filteredContacts);
  const availableLetters = Object.keys(groupedContacts).sort();

  const scrollToLetter = (letter: string) => {
    if (sectionRefs.current[letter]) {
      sectionRefs.current[letter]?.measureLayout(
        // @ts-ignore
        sectionRefs.current[letter]?.getNode(),
        (x, y) => {
          // @ts-ignore
          sectionRefs.current[letter]?.scrollTo({ y, animated: true });
        },
        () => console.log('Failed to measure layout')
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>კონტაქტების სია</Text>
      <View style={styles.searchSortRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="ძებნა..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortField(f => f === 'firstName' ? 'lastName' : 'firstName')}>
          <Text style={styles.sortBtnText}>დალაგება: {sortField === 'firstName' ? 'სახელით' : 'გვარით'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}>
          <Text style={styles.sortBtnText}>{sortDirection === 'asc' ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView}>
          {availableLetters.map(letter => (
            <View key={letter} ref={el => sectionRefs.current[letter] = el}>
              <Text style={styles.letterHeader}>{letter}</Text>
              {groupedContacts[letter].map((contact) => (
                <View key={contact.id} style={styles.contactCard}>
                  <Text style={styles.name}>{contact.firstName} {contact.lastName}</Text>
                  <Text style={styles.phone}>{contact.phoneNumber}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
        <View style={styles.alphabetScroller}>
          {availableLetters.map(letter => (
            <TouchableOpacity key={letter} onPress={() => scrollToLetter(letter)}>
              <Text style={styles.alphabetLetter}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  sortBtn: {
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 4,
  },
  sortBtnText: {
    fontSize: 14,
    color: '#1a4fa3',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  letterHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#e6f0ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  alphabetScroller: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  alphabetLetter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a4fa3',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
});

export default App; 