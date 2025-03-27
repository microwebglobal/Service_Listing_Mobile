import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import OfferCardImages from '../data/carousel';
import classNames from 'classnames';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

interface CarouselProps {
  id: string;
  imageLink: string;
}

export const Carousel = () => {
  let flatListRef = useRef<FlatList<CarouselProps> | null>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewConfigRef = {viewAreaCoveragePercentThreshold: 94};

  //only needed if you want to know the index
  const onViewRef = useRef(({changed}: {changed: any}) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index);
    }
  });
  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({animated: true, index: index});
  };

  // Auto Scroll
  useEffect(() => {
    let interval = setInterval(() => {
      if (currentIndex === OfferCardImages.length - 1) {
        flatListRef.current?.scrollToIndex({animated: true, index: 0});
      } else {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: currentIndex + 1,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  });

  const getItemLayout = (data: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  return (
    <View>
      <FlatList
        className="mt-4 bg-white"
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        snapToInterval={screenWidth}
        snapToAlignment="start"
        decelerationRate="normal"
        data={OfferCardImages}
        renderItem={({item}) => {
          return <Image source={item.imageLink} style={styles.Image} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        ref={ref => {
          flatListRef.current = ref;
        }}
        getItemLayout={getItemLayout}
        viewabilityConfig={viewConfigRef}
        onViewableItemsChanged={onViewRef.current}
      />

      <View className="flex-row justify-center my-5">
        {OfferCardImages.map(({}, index: number) => (
          <TouchableOpacity
            className={classNames('w-2 h-1 mx-[1] bg-lightGrey rounded-lg', {
              'bg-black': index === currentIndex,
            })}
            key={index.toString()}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Image: {
    marginHorizontal: RPW(3),
    width: RPW(94),
    height: RPH(20),
    resizeMode: 'cover',
    borderRadius: 12,
  },
});
