#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <regex>
#include <filesystem>

namespace fs = std::filesystem;

// 替换字符串中的特定序列
std::string replaceSpecialCharactersInUrl(const std::string &url)
{
    std::string result = url;
    // 替换 %2F 为 /
    size_t pos;
    while ((pos = result.find("%2F")) != std::string::npos)
    {
        result.replace(pos, 3, "/");
    }
    // 替换 %3A 为 :
    while ((pos = result.find("%3A")) != std::string::npos)
    {
        result.replace(pos, 3, ":");
    }
    return result;
}

// 处理单个文件
void processFile(const fs::path &file_path, int &count)
{
    // std::cout << "正在处理文件: " << filePath.filename().string() << std::endl;
    std::ifstream file(file_path);
    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string content = buffer.str();
    file.close();

    std::regex url_pattern(R"(http[s]?:\/\/.*\.(jpg|png|jpeg|gif))");
    std::smatch matches;
    std::string::const_iterator search_start(content.cbegin());
    bool flag = true;
    while (std::regex_search(search_start, content.cend(), matches, url_pattern))
    {
        if (flag)
        {
            std::cout << "正在处理文件: " << file_path.string() << '\n';
            flag = false;
        }

        // std::cout << std::string(matches);
        std::string url = matches[0];
        std::string replaced_url = replaceSpecialCharactersInUrl(url);
        content.replace(content.find(url), url.length(), replaced_url);
        search_start = matches.suffix().first;
    }
    if (!flag)
    {
        std::cout << "已完成处理文件: " << file_path.string() << "\n\n";
        count++;
    }
    std::ofstream outFile(file_path);
    outFile << content;
    outFile.close();

    // std::cout << "已完成处理文件: " << file_path.filename().string() << std::endl << std::endl;
    return;
}

int main()
{
    std::string path = "./";
    int count = 0;
    try
    {
        for (const auto &entry : fs::recursive_directory_iterator(path))
        {
            if (entry.path().extension() == ".md")
            {
                processFile(entry.path(), count);
            }
        }
        std::cout << "处理完成！共处理了 " << count << " 个文件。\n";
    }
    catch (const std::exception &e)
    {
        std::cerr << "发生错误：" << e.what() << std::endl;
    }

    return 0;
}
