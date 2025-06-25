import { Client } from '@notionhq/client';
import { NotionPage } from '../types';

export class NotionService {
  private notion: Client;
  private databaseId: string;

  constructor() {
    if (!process.env.NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY環境変数が設定されていません');
    }

    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID環境変数が設定されていません');
    }

    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });

    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  /**
   * Notionデータベースからページを取得
   */
  async getPages(): Promise<NotionPage[]> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        page_size: 1000, // 最大1000件
      });

      return response.results.map((page: any) => ({
        id: page.id,
        properties: page.properties,
      }));
    } catch (error) {
      console.error('Notion API Error:', error);
      throw new Error('Notionからデータを取得できませんでした');
    }
  }

  /**
   * Notionページから物件名（タグ名）を抽出
   */
  extractTagName(page: NotionPage): string | null {
    try {
      // 物件名フィールドを探す（日本語・英語両対応）
      const titleField = this.findTitleField(page.properties);
      
      if (!titleField) {
        return null;
      }

      // タイトルフィールドの値を取得
      const title = this.extractTitleValue(titleField);
      
      // 空文字列や空白のみの場合はnullを返す
      return title && title.trim() ? title.trim() : null;
    } catch (error) {
      console.warn('Tag name extraction failed:', error);
      return null;
    }
  }

  /**
   * プロパティからタイトルフィールドを探す
   */
  private findTitleField(properties: any): any {
    // 物件名、物件、title、nameなどのフィールドを探す
    const titleFieldNames = ['物件名', '物件', 'title', 'Title', 'name', 'Name', 'プロジェクト名', 'プロジェクト'];
    
    for (const fieldName of titleFieldNames) {
      if (properties[fieldName] && properties[fieldName].type === 'title') {
        return properties[fieldName];
      }
    }

    // 見つからない場合は最初のtitleタイプのフィールドを使用
    for (const key in properties) {
      if (properties[key].type === 'title') {
        return properties[key];
      }
    }

    return null;
  }

  /**
   * タイトルフィールドから実際の値を抽出
   */
  private extractTitleValue(titleField: any): string | null {
    try {
      if (titleField.title && Array.isArray(titleField.title) && titleField.title.length > 0) {
        // タイトル配列の最初の要素からプレーンテキストを取得
        const firstTitle = titleField.title[0];
        if (firstTitle.plain_text) {
          return firstTitle.plain_text;
        }
        if (firstTitle.text && firstTitle.text.content) {
          return firstTitle.text.content;
        }
      }
      return null;
    } catch (error) {
      console.warn('Title value extraction failed:', error);
      return null;
    }
  }

  /**
   * Notion APIの接続をテスト
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });
      return true;
    } catch (error) {
      console.error('Notion connection test failed:', error);
      return false;
    }
  }

  /**
   * データベース情報を取得
   */
  async getDatabaseInfo(): Promise<any> {
    try {
      const response = await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });
      return response;
    } catch (error) {
      console.error('Database info retrieval failed:', error);
      throw new Error('Notionデータベース情報の取得に失敗しました');
    }
  }
}