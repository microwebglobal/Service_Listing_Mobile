import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {useNav} from '../navigation/RootNavigation';
import {Category, SubCategory} from '../screens/category/types';

interface ServiceCardProps {
  mode: 'category' | 'subCategory';
  category?: Category;
  subCategory?: SubCategory;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const ServiceCard: React.FC<ServiceCardProps> = ({
  mode,
  category,
  subCategory,
}) => {
  const navigation = useNav();
  const item: any = mode === 'category' ? category : subCategory;

  return (
    <StyledView className="basis-1/2 p-[6px] mt-2">
      <StyledTouchableOpacity
        className="shadow-sm shadow-black rounded-xl"
        onPress={() => {
          mode === 'category'
            ? navigation.navigate('SubCategory', {
                categoryId: item.category_id,
                category: item.name,
                imageUrl: item.icon_url,
              })
            : navigation.navigate('ServiceType', {
                subCategoryId: item.sub_category_id,
                subCategory: item.name,
              });
        }}>
        <StyledView className="flex-1 items-center justify-center shadow-md shadow-black rounded-xl">
          <StyledImage
            className="w-full h-32 rounded-t-lg"
            source={{uri: `${SERVER_BASE}${item.icon_url}`}}
          />
          <StyledView className="w-full px-3 items-center bg-white rounded-b-xl">
            <StyledText className="my-2 text-sm text-black font-PoppinsRegular">
              {item.name}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
};
