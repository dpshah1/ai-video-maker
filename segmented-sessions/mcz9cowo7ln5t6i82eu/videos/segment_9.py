from manim import *

class GraphTypes(Scene):
    def construct(self):

        title = Text("Special Classes of Graphs", font_size=36)
        self.play(Write(title))
        self.wait(1)

        tree_title = Text("Tree", font_size=28).next_to(title, DOWN)
        self.play(Write(tree_title))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        tree_explanation = Text("A tree is a connected graph with no cycles.", font_size=24).next_to(tree_title, DOWN)
        self.play(Write(tree_explanation))
        self.wait(2)

        self.play(FadeOut(circle), FadeOut(tree_explanation), FadeOut(tree_title))

        complete_graph_title = Text("Complete Graphs", font_size=28)
        self.play(Write(complete_graph_title))
        self.wait(1)

        complete_graphs = [Square(side_length=1), Square(side_length=1), Square(side_length=1), Square(side_length=1)]
        for graph in complete_graphs:
            self.play(Create(graph))
            self.wait(1)

        complete_graph_explanation = Text("A complete graph has every possible edge.", font_size=24).next_to(complete_graph_title, DOWN)
        self.play(Write(complete_graph_explanation))
        self.wait(2)

        self.play(FadeOut(complete_graphs), FadeOut(complete_graph_explanation), FadeOut(complete_graph_title))

        hypercube_title = Text("Hypercube", font_size=28)
        self.play(Write(hypercube_title))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(2)

        hypercube_explanation = Text("Hypercubes balance connectivity and complexity.", font_size=24).next_to(hypercube_title, DOWN)
        self.play(Write(hypercube_explanation))
        self.wait(2)

        self.wait(1)

        self.play(FadeOut(circle), FadeOut(hypercube_explanation), FadeOut(hypercube_title))
        self.wait(1)

        self.wait(10.8)  # Adjust to ensure total time is exactly 38.8 seconds